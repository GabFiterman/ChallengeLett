/** 
 * Criada uma função anônima autoInvocável
 * por questões de segurança persistência das
 * informações.
 */
(function () {
    //Caputra dos elementos DOM necessários em ordem de renderização no HTML

    //FormArea
    const inputSearch = document.querySelector('.inputSearch');
    const btnSearch = document.querySelector('.btnSearch');
    const btnFilter = document.querySelector('.btnFilter');

    //notFound
    const notFound = document.querySelector('#notFound');

    //mainResult
    const mainResult = document.querySelector('.mainResult');
    const profile = document.querySelector('#profile');

    //Pagination
    const pagination = document.querySelector('#pagination');
    const paginationFiltered = document.querySelector('#paginationFiltered');

    const btnPrevious = document.querySelector('.btnPrevious');
    const btnNext = document.querySelector('.btnNext');

    const btnPreviousFiltered = document.querySelector('.btnPreviousFiltered');
    const btnNextFiltered = document.querySelector('.btnNextFiltered');

    const actualPageNumber = document.querySelector('.pageNumber');
    const actualPageNumberFiltered = document.querySelector('.pageNumberFiltered');


    //Variávies para o consumo da API
    const url = 'https://api.github.com';
    const client_id = 'a758c30ae6bd78739ead';
    const client_secret = 'e662535f645fa548b9ade32174b5d876e4f50c27';
    const count = 50;
    const sort = "created: asc";
    let user = '';

    // Variávies de numeração das páginas
    let pageNumber = 1;
    let pageNumberFiltered = 1;

    //Já carregar a página facilitando a vida do usuário
    inputSearch.focus();

    /**
     * Função assíncrona que faz a requsição da API e aguarda repostas em JSON de:
     * Profile - Perfil de usuário existente no gitHub
     * Repository - Repositórios limitados a 50 (const count) organizados por ordem de criação (const sort) do usuário em questão
     * @param {Usuário digitado pelo inputSearch} user 
     * @returns profile, repos
     */
    async function getUser(user) {
        console.log(`Buscando o usuário: "${user}"`);

        // Primeiro busca o usuário e aguarda a reposta da URL
        const profileResponse = await fetch(
            `${url}/users/${user}?client_id=${client_id}&client_secret=${client_secret}`
        );

        // Em seguida busca seus repositórios e também aguarda sua resposta
        const reposResponse = await fetch(
            `${url}/users/${user}/repos?per_page=${count}&sort=${sort}&client_id=${client_id}&client_secret=${client_secret}&page=${pageNumber}`
        );

        // Variáveis de armazenamento dos JSON de reposta
        const profile = await profileResponse.json();
        const repos = await reposResponse.json();

        // Amrmazena o usuário em uma função
        storageUser(user);

        return { profile, repos };
    }

    /**
     * Função apenas para armazenar o usuário,
     * [tive alguns problemas tentando utilizando variável,
     * a utilização da função conseguiu atender]
     * @param {usuário adquirido pela função getUser} user 
     * @returns user
     */
    function storageUser(user) {
        console.info(`Armazenando o usuário: "${user}"`);
        return user;
    };

    /**
     * Função que exibe o usuário se ele existir
     * ou invocar a função que exibe o erro 404
     * @param {usuário passado pelo inputSearch} user 
     */
    function showProfile(user) {

        if (typeof user.login === undefined) {
            showError404();
        } else {
            profile.innerHTML = /*<div id="profile">*/`
                <aside class="profile flex">
                    <img class="profilePhoto" src="${user.avatar_url}" alt="Foto de Perfil" />
                    <div class="profileInformation">
                        <h4 class="profileName">${user.name}</h4>
                    <ul class="profileInfos">
                        <li class="profileInfo">Repositórios: <span class="profileInfoQuantity">${user.public_repos}</span></li>
                        <li class="profileInfo">Seguidores: <span class="profileInfoQuantity">${user.followers}</span></li>
                        <li class="profileInfo">Seguindo: <span class="profileInfoQuantity">${user.following}</span></li>
                    </ul>
                    <button class="btn btnProfile"><a href="${user.html_url}" target="_blank">Ver Perfil</a></button>
                    </div>
                    
                </aside>
            `;
        }

    }

    /**
     * Função que faz um laço para exibir os repositórios de um usuário,
     * sob condições de sua função "mãe" (getReposFiltered)
     * @param {repositórios buscados de um usuário pela API} repos 
     */
    function showRepos(repos) {

        let output = '';

        repos.forEach(repo => {
            output += `
            <div class="card flex">
                <a class="cardName" href="${repo.html_url}" target="_blank">${repo.name}</a>

                <div class="cardStatisticsGroup flex">

                    <span class="cardStatistic cardStar flex">
                        <img class="cardIcon" src="./assets/img/Star.svg" alt="Star" />
                        <p class="starName">Star: <strong class="starCount">${repo.stargazers_count}</strong></p>
                    </span>

                    <span class="cardStatistic cardWatch flex">
                        <img class="cardIcon" src="./assets/img/Eye.svg" alt="Eye" />
                        <p class="watchName">Watch: <strong class="watchCount">${repo.watchers_count}</strong></p>
                    </span>

                    <span class="cardStatistic cardFork flex">
                        <img class="cardIcon" src="./assets/img/Fork.svg" alt="Fork" />
                        <p class="forkName">Fork: <strong class="forkCount">${repo.forks_count}</strong></p>
                    </span>
                </div>
            </div>
            `;
        });
        document.querySelector('#repos').innerHTML = output;
    }

    /**
     * Função assíncrona que faz uma requisição para a API
     * do tipo search por pesquisas incompletas, buscando nos repositórios
     * do último usuário carregado (e que está sendo exibido na tela)
     * @param {Repositório digitado pelo inputSearch} reposName 
     * @returns reposFiltered
     */
    async function getReposFiltered(reposName) {
        const reposResponse = await fetch(
            `${url}/search/repositories?q=${reposName}+in:name+user:${user}&per_page=${count}&sort=${sort}&client_id=${client_id}&client_secret=${client_secret}&page=${pageNumberFiltered}`
        );

        const reposFiltered = await reposResponse.json();

        return { reposFiltered };

    }

    /**
     * Função que faz um laço para exibir os repositórios filtrados de um usuário,
     * sob condições de sua função "mãe" (getUser)
     * @param {repositórios filtrados pelo inputSearch de um usuário pela API} repos 
     */
    function showReposFiltered(repos) {
        let output = '';

        repos.items.forEach(repo => {
            output += `
            <div class="card flex">
                <a class="cardName" href="${repo.html_url}" target="_blank">${repo.name}</a>
        
                <div class="cardStatisticsGroup flex">
        
                    <span class="cardStatistic cardStar flex">
                        <img class="cardIcon" src="./assets/img/Star.svg" alt="Star" />
                        <p class="starName">Star: <strong class="starCount">${repo.stargazers_count}</strong></p>
                    </span>
        
                    <span class="cardStatistic cardWatch flex">
                        <img class="cardIcon" src="./assets/img/Eye.svg" alt="Eye" />
                        <p class="watchName">Watch: <strong class="watchCount">${repo.watchers_count}</strong></p>
                    </span>
        
                    <span class="cardStatistic cardFork flex">
                        <img class="cardIcon" src="./assets/img/Fork.svg" alt="Fork" />
                        <p class="forkName">Fork: <strong class="forkCount">${repo.forks_count}</strong></p>
                    </span>
        
                </div>
        
            </div>
            `;
        });

        document.querySelector('#repos').innerHTML = output;
    }

    /**
     * Função específica para limpar a tela de todos os repositórios
     * que possam ter sido exibidos
     */
    function clearRepos() {
        document.querySelector('#repos').innerHTML = `
        <div class="card flex">
                <a></a>
                <div>
                    <span>
                        <p></p>
                    </span>
                    <span>
                        <p></p>
                    </span>
                    <span>
                        <p></p></p>
                    </span>
                </div>
        </div>
        `;
    }

    /**
     * Função que exibe uma tratativa de erro 404 simples
     */
    function showError404() {
        console.log(`****** User showError404(): "${user}" ******\n`);
        notFound.innerHTML = `
        <div class="notFound">
            <h1 class="notFoundTitle">Todo mundo erra...</h1>
            <div class="notFoundBox flex">
                <img class="notFoundImg" src="./assets/img/Error404.webp" alt="404 Not Found">
                <div class="notFoundInfo">
                    <p class="notFoundText">
                        Não encontramos nenhum usuário com o nome "${user}",
                        por favor verifique a ortografia e tente novamente.
                    </p>
                </div>
            </div>
        </div>
        `;
    }


    /**
     * Função de pesquisa principal,
     * invocando o consumo da API e exibindo a tela
     * 
     */
    function mainSearch() {
        //captura do usuário digitado
        user = inputSearch.value;
        pageNumber = 1;

        //função que invoca o consumo da API
        (function () {
            getUser(user).then(res => {
                console.log(`Pesquisado o login de usuário: "${res.profile.login}"`);

                //Tentativa de exibição, que retorna erro 404 caso o login de usuário seja indefinido (user inexistente)
                try {
                    profile.classList.remove('hidden');
                    showProfile(res.profile);
                    showRepos(res.repos);
                    actualPageNumber.innerHTML = pageNumber;

                    //alterações no DOM que podem ser necessárias
                    btnFilter.classList.remove('hidden');
                    pagination.classList.remove('displayNone');
                    paginationFiltered.classList.add('displayNone');
                    mainResult.classList.add('flex');
                    mainResult.classList.remove('displayNone');
                    notFound.classList.add('displayNone');

                } catch {
                    //alterações no DOM que podem ser necessárias
                    paginationFiltered.classList.add('displayNone');
                    notFound.classList.remove('displayNone');
                    mainResult.classList.remove('flex');
                    mainResult.classList.add('displayNone');

                    showError404();
                }

            });
        })();

        //retorna o foco do teclado à caixa de pesquisa
        inputSearch.value = '';
        inputSearch.focus();
    }

    // Ação via tecla enter para a pesquisa principal
    document.querySelector('body').addEventListener('keydown', function (ev) {
        const tecla = ev.keyCode;
        if (tecla == 13) {
            mainSearch();
        }
    });

    // Ação via botão "Pesquisar" para a pesquisa principal
    btnSearch.onclick = function () {
        mainSearch();
    }

    /**
     * Ação via botão "Filtrar" para aplicar o filtro pesquisado no usuário exibido
     */
    btnFilter.onclick = function () {
        const filter = inputSearch.value;
        const Usuario = storageUser(user);
        pageNumberFiltered = 1;
        actualPageNumberFiltered.innerHTML = pageNumberFiltered;

        //Função para realizar o filtro de pesquisa
        (function () {
            console.log(`Buscando "${filter}" no usuário "${Usuario}"`);
            clearRepos();

            getReposFiltered(filter).then(res => {
                showReposFiltered(res.reposFiltered);
            });

        })();

        pagination.classList.add('displayNone');
        paginationFiltered.classList.remove('displayNone');
    }

    /**
     * Ação para o botão next (>) que realiza outra pesquisa, exibindo a próxima página
     * por não estar consumindo a paginação da API, e sim realizando outra pesquisa, exibindo a próxima página
     * não foi possível fazer tratativa caso nenhum resultado seja encontrado.
     * Porém na usabilidade ficou intuitivo que resultados não foram encontrados!
     */
    btnNext.onclick = function () {
        pageNumber++;
        actualPageNumber.innerHTML = pageNumber;
        window.scrollTo(0, 0);

        (function () {
            getUser(user).then(res => {
                console.log(`Exibindo a página "${pageNumber}" de repositórios de: "${res.profile.login}"`);
                showProfile(res.profile);
                showRepos(res.repos);
            });
        })();
    }

    /**
     * Ação para o botão previous (<) que realiza outra pesquisa, exibindo a página anterior
     * semelhante ao funcionamento de seu botão irmão (next), porém tratei de impedir que o
     * usuário navegue por páginas inexistentes
     */
    btnPrevious.onclick = function previousPage() {
        if (pageNumber >= 2) {
            pageNumber--;
            (function () {
                getUser(user).then(res => {
                    console.log(`Exibindo a página "${pageNumber}" de repositórios de: "${res.profile.login}"`);
                    showProfile(res.profile);
                    showRepos(res.repos);
                });
            })();
            actualPageNumber.innerHTML = pageNumber;
            window.scrollTo(0, 0);
        }
    }

    /**
     * Ação para o botão nextFiltered (>) que realiza outra pesquisa filtrada, exibindo a próxima página filtrada
     * semelhante ao botão next.
     */
    btnNextFiltered.onclick = function () {
        const filter = inputSearch.value;
        const Usuario = storageUser(user);

        pageNumberFiltered++;
        actualPageNumberFiltered.innerHTML = pageNumberFiltered;
        window.scrollTo(0, 0);

        (function () {
            console.log(`Exibindo a página "${pageNumber}" de repositórios de: "${Usuario}"`);
            clearRepos();

            getReposFiltered(filter).then(res => {
                showReposFiltered(res.reposFiltered);
            });
        })();

    }

    /**
     * Ação para o botão PreviousFiltered (>) que realiza outra pesquisa filtrada, exibindo a página filtrada anterior
     * semelhante ao botão previous.
     */
    btnPreviousFiltered.onclick = function () {
        if (pageNumberFiltered >= 2) {
            pageNumberFiltered--;
            const filter = inputSearch.value;
            const Usuario = storageUser(user);

            (function () {
                console.log(`Exibindo a página "${pageNumber}" de repositórios de: "${Usuario}"`);
                clearRepos();

                getReposFiltered(filter).then(res => {
                    showReposFiltered(res.reposFiltered);
                });
            })();

            actualPageNumberFiltered.innerHTML = pageNumberFiltered;
            window.scrollTo(0, 0);
        }
    }

})();
