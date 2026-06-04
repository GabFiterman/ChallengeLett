(function () {
    //Caputra dos elementos DOM necessários em ordem de renderização no HTML

    //FormArea
    const inputSearch = document.querySelector('.inputSearch');
    const btnSearch = document.querySelector('.btnSearch');
    const btnFilter = document.querySelector('.btnFilter');
    const autocompleteDropdown = document.querySelector('#autocompleteDropdown');
    const bulbIcon = document.querySelector('#bulbIcon');
    const instructionsBalloon = document.querySelector('#instructionsBalloon');

    //notFound
    const notFound = document.querySelector('#notFound');

    //Users search results
    const usersSearchSection = document.querySelector('#usersSearchSection');
    const usersGrid = document.querySelector('#usersGrid');
    const paginationUsers = document.querySelector('#paginationUsers');
    const btnPreviousUsers = document.querySelector('.btnPreviousUsers');
    const btnNextUsers = document.querySelector('.btnNextUsers');
    const actualPageNumberUsers = document.querySelector('.pageNumberUsers');
    const pageCountTextUsers = document.querySelector('.pageCountTextUsers');

    //mainResult
    const mainResult = document.querySelector('.mainResult');
    const profile = document.querySelector('#profile');

    //Dynamic Filter
    const dynamicFilterArea = document.querySelector('#dynamicFilterArea');
    const inputRepoFilter = document.querySelector('.inputRepoFilter');

    //Pagination
    const pagination = document.querySelector('#pagination');
    const paginationFiltered = document.querySelector('#paginationFiltered');

    const btnPrevious = document.querySelector('.btnPrevious');
    const btnNext = document.querySelector('.btnNext');

    const btnPreviousFiltered = document.querySelector('.btnPreviousFiltered');
    const btnNextFiltered = document.querySelector('.btnNextFiltered');

    const actualPageNumber = document.querySelector('.pageNumber');
    const actualPageNumberFiltered = document.querySelector('.pageNumberFiltered');

    const pageCountText = document.querySelector('.pageCountText');
    const pageCountTextFiltered = document.querySelector('.pageCountTextFiltered');

    //Variávies para o consumo da API
    const url = 'https://api.github.com';
    const count = 20;
    const countUsers = 25;
    const sort = "created: asc";

    let user = '';
    let searchQuery = '';
    let totalPublicRepos = 0;
    let totalFilteredRepos = 0;
    let totalUsersCount = 0;

    // Variávies de numeração das páginas
    let pageNumber = 1;
    let pageNumberFiltered = 1;
    let pageNumberUsers = 1;

    // Controle de índice ativo no Autocomplete
    let activeSuggestionIndex = -1;

    // Já carregar a página facilitando a vida do usuário
    inputSearch.focus();

    // UTILITÁRIO DE CACHE & RATE LIMIT
    async function cachedFetch(endpoint) {
        // Verifica cache em sessionStorage
        const cachedData = sessionStorage.getItem(endpoint);
        if (cachedData) {
            try {
                const parsed = JSON.parse(cachedData);
                // Valida expiração de 5 minutos
                if (Date.now() - parsed.timestamp < 300000) {
                    console.log(`[Cache Hit] Carregado de cache: ${endpoint}`);
                    return parsed.data;
                }
            } catch (e) {
                // Se der erro ao fazer parse, limpa
                sessionStorage.removeItem(endpoint);
            }
        }

        console.log(`[Cache Miss] Requisitando API: ${endpoint}`);
        const response = await fetch(endpoint);

        if (response.status === 403) {
            const errData = await response.json();
            if (errData.message && errData.message.includes('rate limit exceeded')) {
                showRateLimitError();
                throw new Error('API Rate Limit Exceeded');
            }
        }

        if (!response.ok) {
            throw new Error(`API Request Failed with status ${response.status}`);
        }

        const data = await response.json();

        // Salva no sessionStorage
        try {
            sessionStorage.setItem(endpoint, JSON.stringify({
                timestamp: Date.now(),
                data: data
            }));
        } catch (e) {
            console.warn('Falha ao gravar sessionStorage (provavelmente cota cheia)', e);
        }

        return data;
    }

    function showRateLimitError() {
        usersSearchSection.classList.add('displayNone');
        paginationUsers.classList.add('displayNone');
        mainResult.classList.add('displayNone');
        mainResult.classList.remove('flex');
        dynamicFilterArea.classList.add('displayNone');
        notFound.classList.remove('displayNone');

        notFound.innerHTML = `
        <div class="notFound" style="display: flex; flex-direction: row; align-items: flex-start; justify-content: center; max-width: 780px; margin: 5vh auto; padding: 0 1rem; gap: 20px;">
            <img class="notFoundImg" src="./assets/img/Error_Limit_Exceeded.webp" alt="API Limit Exceeded" style="width: 315px; height: auto; flex-shrink: 0;">
            <div style="position: relative; background-color: rgba(11, 10, 13, 0.95); border: 2px solid #ff3d00; border-radius: 1rem; padding: 1.5rem; box-shadow: 0 8px 20px rgba(0,0,0,0.5); flex-grow: 1; box-sizing: border-box; margin-top: 10px;">
                <!-- Flecha do balão apontando para o gatinho à esquerda -->
                <div style="position: absolute; top: 30px; right: 100%; border: 10px solid transparent; border-right-color: #ff3d00;"></div>
                
                <h2 style="color: #ff3d00; font-size: 1.3rem; margin-bottom: 0.5rem; font-weight: bold; text-align: left;">⚠️ Limite Excedido</h2>
                <p style="font-size: 0.95rem; line-height: 1.5; color: var(--mainText); text-align: left; margin: 0;">
                    O limite de requisições da API pública do GitHub foi excedido para o seu endereço IP. <br>
                    Aguarde alguns minutos ou tente novamente mais tarde.
                </p>
            </div>
        </div>
        `;
    }

    // LÓGICA DO BALÃO DE INSTRUÇÕES (BULB)
    let isPinned = false;
    let closeBalloonTimer;

    function openBalloon() {
        clearTimeout(closeBalloonTimer);
        instructionsBalloon.classList.remove('displayNone');
    }

    function closeBalloon() {
        if (!isPinned) {
            instructionsBalloon.classList.add('displayNone');
        }
    }

    // Abre por 6 segundos no carregamento inicial
    openBalloon();
    closeBalloonTimer = setTimeout(() => {
        closeBalloon();
    }, 6000);

    // Fechar ao clicar no próprio balão ou no botão X
    instructionsBalloon.addEventListener('click', function (e) {
        isPinned = false;
        instructionsBalloon.classList.add('displayNone');
    });

    // Hover na lâmpada
    bulbIcon.addEventListener('mouseenter', openBalloon);
    bulbIcon.addEventListener('mouseleave', () => {
        closeBalloonTimer = setTimeout(closeBalloon, 300);
    });

    // Hover no próprio balão para mantê-lo aberto
    instructionsBalloon.addEventListener('mouseenter', () => {
        clearTimeout(closeBalloonTimer);
    });
    instructionsBalloon.addEventListener('mouseleave', () => {
        closeBalloonTimer = setTimeout(closeBalloon, 300);
    });

    // Clicar na lâmpada fixa / desfixa o balão
    bulbIcon.addEventListener('click', function (e) {
        e.stopPropagation();
        isPinned = !isPinned;
        if (isPinned) {
            openBalloon();
        } else {
            instructionsBalloon.classList.add('displayNone');
        }
    });

    // Auxiliar de debounce
    let debounceTimer;
    function debounce(func, delay) {
        return function (...args) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(this, args), delay);
        };
    }

    /**
     * Listener para o input de busca para fazer autocomplete
     */
    inputSearch.addEventListener('input', debounce(async function () {
        const query = inputSearch.value.trim();
        activeSuggestionIndex = -1;
        if (query.length < 2) {
            autocompleteDropdown.innerHTML = '';
            autocompleteDropdown.classList.add('displayNone');
            return;
        }

        try {
            const data = await cachedFetch(`${url}/search/users?q=${query}&per_page=5`);

            if (data.items && data.items.length > 0) {
                let dropdownHtml = '';
                data.items.forEach((u, index) => {
                    dropdownHtml += `
                        <div class="autocompleteItem" data-login="${u.login}" data-index="${index}">
                            <img class="autocompleteAvatar" src="${u.avatar_url}" alt="${u.login}">
                            <span class="autocompleteLogin">${u.login}</span>
                        </div>
                    `;
                });
                autocompleteDropdown.innerHTML = dropdownHtml;
                autocompleteDropdown.classList.remove('displayNone');

                // Adiciona cliques a cada sugestão
                document.querySelectorAll('.autocompleteItem').forEach(item => {
                    item.addEventListener('click', function () {
                        const selectedLogin = this.getAttribute('data-login');
                        inputSearch.value = selectedLogin;
                        autocompleteDropdown.classList.add('displayNone');
                        loadUserProfileAndRepos(selectedLogin);
                    });
                });
            } else {
                autocompleteDropdown.innerHTML = '';
                autocompleteDropdown.classList.add('displayNone');
            }
        } catch (err) {
            console.error('Erro no autocomplete:', err);
        }
    }, 300));

    /**
     * Atalhos de Teclado no inputSearch (Setas e Escape)
     */
    inputSearch.addEventListener('keydown', function (ev) {
        const key = ev.key;
        const items = document.querySelectorAll('.autocompleteItem');

        if (items.length > 0 && !autocompleteDropdown.classList.contains('displayNone')) {
            if (key === 'ArrowDown') {
                ev.preventDefault();
                activeSuggestionIndex = (activeSuggestionIndex + 1) % items.length;
                highlightSuggestion(items);
            } else if (key === 'ArrowUp') {
                ev.preventDefault();
                activeSuggestionIndex = (activeSuggestionIndex - 1 + items.length) % items.length;
                highlightSuggestion(items);
            } else if (key === 'Escape') {
                autocompleteDropdown.innerHTML = '';
                autocompleteDropdown.classList.add('displayNone');
            } else if (key === 'Enter') {
                if (activeSuggestionIndex > -1) {
                    ev.preventDefault();
                    const selectedItem = items[activeSuggestionIndex];
                    const selectedLogin = selectedItem.getAttribute('data-login');
                    inputSearch.value = selectedLogin;
                    autocompleteDropdown.classList.add('displayNone');
                    loadUserProfileAndRepos(selectedLogin);
                }
            }
        } else if (key === 'Enter') {
            mainSearch();
        }
    });

    function highlightSuggestion(items) {
        items.forEach(item => item.classList.remove('activeSuggestion'));
        if (activeSuggestionIndex > -1) {
            const activeItem = items[activeSuggestionIndex];
            activeItem.classList.add('activeSuggestion');
            activeItem.scrollIntoView({ block: 'nearest' });
        }
    }

    // Fechar autocomplete ao clicar fora dele
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.inputContainer')) {
            autocompleteDropdown.innerHTML = '';
            autocompleteDropdown.classList.add('displayNone');
        }
    });

    /**
     * Listener de Filtro Dinâmico nos Repositórios
     */
    inputRepoFilter.addEventListener('input', debounce(async function () {
        const filterVal = inputRepoFilter.value.trim();
        if (filterVal === '') {
            // Se limpar, volta para a lista normal na página atual
            pagination.classList.remove('displayNone');
            paginationFiltered.classList.add('displayNone');
            getUser(user).then(res => {
                showRepos(res.repos);
                updatePaginationControls();
            });
            return;
        }

        pageNumberFiltered = 1;
        pagination.classList.add('displayNone');
        paginationFiltered.classList.remove('displayNone');

        await runFilteredSearch(filterVal);
    }, 300));

    async function runFilteredSearch(filterText) {
        clearRepos();
        try {
            const { reposFiltered } = await getReposFiltered(filterText);
            totalFilteredRepos = reposFiltered.total_count || 0;
            showReposFiltered(reposFiltered);
            updatePaginationControlsFiltered();
        } catch (err) {
            console.error('Erro na filtragem:', err);
        }
    }

    /**
     * Busca perfis de usuários na API do GitHub
     */
    async function searchUsers(query) {
        console.log(`Buscando usuários por correspondência de nome: "${query}", página ${pageNumberUsers}`);
        const data = await cachedFetch(`${url}/search/users?q=${query}&per_page=${countUsers}&page=${pageNumberUsers}`);
        totalUsersCount = data.total_count || 0;
        return data;
    }

    /**
     * Exibe o grid de perfis de usuários encontrados
     */
    async function showUsersSearchResults(data) {
        if (!data.items || data.items.length === 0) {
            usersGrid.innerHTML = `
                <p style="color: var(--mainText); text-align: center; width: 100%; font-weight: bold;">Nenhum usuário correspondente encontrado.</p>
            `;
            return;
        }

        // Renderiza os placeholders iniciais dos cartões grandes
        let output = '';
        data.items.forEach(u => {
            output += `
                <div class="userLargeCard" id="user-card-${u.login}">
                    <img class="userLargeAvatar" src="${u.avatar_url}" alt="${u.login}">
                    <h3 class="userLargeLogin">${u.login}</h3>
                    <div class="userLargeStats" style="margin-bottom: 1.5rem; font-size: 0.85rem; color: var(--mainText); opacity: 0.85;">
                        Carregando estatísticas...
                    </div>
                    <button class="btnViewRepos" data-login="${u.login}">Ver Repositórios</button>
                </div>
            `;
        });
        usersGrid.innerHTML = output;

        // Adiciona listeners para os botões
        document.querySelectorAll('.btnViewRepos').forEach(btn => {
            btn.addEventListener('click', function () {
                const selectedLogin = this.getAttribute('data-login');
                loadUserProfileAndRepos(selectedLogin);
            });
        });

        // Busca e popula os detalhes extras assincronamente (repos, seguidores, seguindo)
        data.items.forEach(async (u) => {
            try {
                const fullUser = await cachedFetch(`${url}/users/${u.login}`);

                const statsDiv = document.querySelector(`#user-card-${u.login} .userLargeStats`);
                if (statsDiv) {
                    statsDiv.innerHTML = `
                        <div style="display: flex; gap: 0.75rem; justify-content: center; font-weight: 500;">
                            <span>Repos: <strong style="color: var(--main);">${fullUser.public_repos ?? 0}</strong></span> |
                            <span>Seguidores: <strong style="color: var(--main);">${fullUser.followers ?? 0}</strong></span> |
                            <span>Seguindo: <strong style="color: var(--main);">${fullUser.following ?? 0}</strong></span>
                        </div>
                    `;
                }
            } catch (err) {
                console.error(`Erro ao carregar detalhes extras para ${u.login}:`, err);
            }
        });
    }

    /**
     * Carrega os repositórios e perfil de um usuário selecionado
     */
    function loadUserProfileAndRepos(selectedLogin) {
        // Esconde a listagem de usuários e paginação dela
        usersSearchSection.classList.add('displayNone');
        paginationUsers.classList.add('displayNone');

        pageNumber = 1;
        inputRepoFilter.value = '';

        getUser(selectedLogin).then(res => {
            profile.classList.remove('hidden');
            showProfile(res.profile);
            showRepos(res.repos);
            updatePaginationControls();

            // Altera elementos DOM
            dynamicFilterArea.classList.remove('displayNone');
            pagination.classList.remove('displayNone');
            mainResult.classList.add('flex');
            mainResult.classList.remove('displayNone');
            notFound.classList.add('displayNone');
        }).catch(err => {
            console.error('Erro ao carregar repositórios:', err);
        });
    }

    /**
     * Função assíncrona que faz a requsição da API e aguarda repostas em JSON de:
     * Profile - Perfil de usuário existente no gitHub
     */
    async function getUser(user) {
        console.log(`Buscando o usuário: "${user}"`);

        const profile = await cachedFetch(`${url}/users/${user}`);
        const repos = await cachedFetch(`${url}/users/${user}/repos?per_page=${count}&sort=${sort}&page=${pageNumber}`);

        // Armazena a quantidade de repositórios públicos
        totalPublicRepos = profile.public_repos || 0;

        // Amrmazena o usuário em uma função
        storageUser(user);

        return { profile, repos };
    }

    /**
     * Função apenas para armazenar o usuário
     */
    function storageUser(u) {
        user = u;
        console.info(`Armazenando o usuário: "${user}"`);
        return user;
    }

    /**
     * Exibe o card do perfil selecionado
     */
    function showProfile(user) {
        if (user.login === undefined) {
            showError404();
        } else {
            profile.innerHTML = `
                <aside class="profile flex">
                    <img class="profilePhoto" src="${user.avatar_url}" alt="Foto de Perfil" />
                    <div class="profileInformation">
                        <h4 class="profileName">${user.name || user.login}</h4>
                    <ul class="profileInfos">
                        <li class="profileInfo">Repositórios: <span class="profileInfoQuantity">${user.public_repos}</span></li>
                        <li class="profileInfo">Seguidores: <span class="profileInfoQuantity">${user.followers}</span></li>
                        <li class="profileInfo">Seguindo: <span class="profileInfoQuantity">${user.following}</span></li>
                    </ul>
                    <button class="btn btnProfile"><a href="${user.html_url}" target="_blank" style="color: inherit; text-decoration: none; display: block; width: 100%;">Ver Perfil</a></button>
                    </div>
                </aside>
            `;
        }
    }

    /**
     * Renderiza o grid de repositórios do usuário
     */
    function showRepos(repos) {
        let output = '';

        if (!Array.isArray(repos) || repos.length === 0) {
            document.querySelector('#repos').innerHTML = `
                <div class="card flex" style="justify-content: center; width: 100%; cursor: default;">
                    <p style="color: var(--mainText); font-weight: bold; padding: 1rem;">Nenhum repositório público encontrado.</p>
                </div>
            `;
            return;
        }

        repos.forEach(repo => {
            output += `
            <div class="card flex" onclick="window.open('${repo.html_url}', '_blank')">
                <a class="cardName" href="${repo.html_url}" target="_blank" onclick="event.stopPropagation()">${repo.name}</a>

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
     * Busca os repositórios filtrados
     */
    async function getReposFiltered(reposName) {
        const reposFiltered = await cachedFetch(
            `${url}/search/repositories?q=${reposName}+in:name+user:${user}&per_page=${count}&sort=${sort}&page=${pageNumberFiltered}`
        );
        return { reposFiltered };
    }

    /**
     * Exibe o grid de repositórios filtrados
     */
    function showReposFiltered(repos) {
        let output = '';

        if (!repos.items || repos.items.length === 0) {
            document.querySelector('#repos').innerHTML = `
                <div class="card flex" style="justify-content: center; width: 100%; cursor: default;">
                    <p style="color: var(--mainText); font-weight: bold; padding: 1rem;">Nenhum repositório correspondente ao filtro encontrado.</p>
                </div>
            `;
            return;
        }

        repos.items.forEach(repo => {
            output += `
            <div class="card flex" onclick="window.open('${repo.html_url}', '_blank')">
                <a class="cardName" href="${repo.html_url}" target="_blank" onclick="event.stopPropagation()">${repo.name}</a>
        
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

    function clearRepos() {
        document.querySelector('#repos').innerHTML = '';
    }

    function showError404() {
        notFound.innerHTML = `
        <div class="notFound" style="display: flex; flex-direction: row; align-items: flex-start; justify-content: center; max-width: 780px; margin: 5vh auto; padding: 0 1rem; gap: 20px;">
            <img class="notFoundImg" src="./assets/img/Error404.webp" alt="404 Not Found" style="width: 315px; height: auto; flex-shrink: 0;">
            <div style="position: relative; background-color: rgba(11, 10, 13, 0.95); border: 2px solid var(--main); border-radius: 1rem; padding: 1.5rem; box-shadow: 0 8px 20px rgba(0,0,0,0.5); flex-grow: 1; box-sizing: border-box; margin-top: 10px;">
                <!-- Flecha do balão apontando para o gatinho à esquerda -->
                <div style="position: absolute; top: 30px; right: 100%; border: 10px solid transparent; border-right-color: var(--main);"></div>
                
                <h2 style="color: var(--main); font-size: 1.3rem; margin-bottom: 0.5rem; font-weight: bold; text-align: left;">Todo mundo erra...</h2>
                <p style="font-size: 0.95rem; line-height: 1.5; color: var(--mainText); text-align: left; margin: 0;">
                    Não encontramos nenhum usuário com o nome <strong style="color: var(--main); word-break: break-all;">"${searchQuery}"</strong>.<br>
                    Por favor, verifique a ortografia e tente novamente.
                </p>
            </div>
        </div>
        `;
    }

    function updatePaginationControls() {
        const totalPages = Math.ceil(totalPublicRepos / count) || 1;
        actualPageNumber.innerHTML = pageNumber;
        pageCountText.innerHTML = `de ${totalPages}`;

        btnPrevious.disabled = (pageNumber <= 1);
        btnNext.disabled = (pageNumber >= totalPages);
    }

    function updatePaginationControlsFiltered() {
        const totalPages = Math.ceil(totalFilteredRepos / count) || 1;
        actualPageNumberFiltered.innerHTML = pageNumberFiltered;
        pageCountTextFiltered.innerHTML = `de ${totalPages}`;

        btnPreviousFiltered.disabled = (pageNumberFiltered <= 1);
        btnNextFiltered.disabled = (pageNumberFiltered >= totalPages);
    }

    function updatePaginationControlsUsers() {
        const totalPages = Math.ceil(totalUsersCount / countUsers) || 1;
        actualPageNumberUsers.innerHTML = pageNumberUsers;
        pageCountTextUsers.innerHTML = `de ${totalPages}`;

        btnPreviousUsers.disabled = (pageNumberUsers <= 1);
        btnNextUsers.disabled = (pageNumberUsers >= totalPages);
    }

    /**
     * Lógica de Pesquisa Principal: Agora traz a listagem de usuários correspondentes
     */
    function mainSearch() {
        autocompleteDropdown.classList.add('displayNone');

        searchQuery = inputSearch.value.trim();
        if (searchQuery === '') return;

        pageNumberUsers = 1;

        // Oculta resultados antigos
        mainResult.classList.add('displayNone');
        mainResult.classList.remove('flex');
        notFound.classList.add('displayNone');
        dynamicFilterArea.classList.add('displayNone');

        // Chama a listagem de usuários
        searchUsers(searchQuery).then(res => {
            if (!res.items || res.items.length === 0) {
                showError404();
                notFound.classList.remove('displayNone');
                usersSearchSection.classList.add('displayNone');
                paginationUsers.classList.add('displayNone');
            } else {
                usersSearchSection.classList.remove('displayNone');
                showUsersSearchResults(res);
                updatePaginationControlsUsers();
                paginationUsers.classList.remove('displayNone');
            }
        }).catch(err => {
            console.error(err);
            // Se já não renderizou o modal de rate limit, mostra o erro normal 404
            if (!notFound.innerHTML.includes('Limite Excedido')) {
                showError404();
                notFound.classList.remove('displayNone');
            }
            usersSearchSection.classList.add('displayNone');
            paginationUsers.classList.add('displayNone');
        });

        inputSearch.value = '';
        inputSearch.focus();
    }

    // Botão Pesquisar
    btnSearch.onclick = function () {
        mainSearch();
    }

    // Paginação da Pesquisa de Usuários
    btnNextUsers.onclick = function () {
        const totalPages = Math.ceil(totalUsersCount / countUsers) || 1;
        if (pageNumberUsers < totalPages) {
            pageNumberUsers++;
            window.scrollTo(0, 0);
            searchUsers(searchQuery).then(res => {
                showUsersSearchResults(res);
                updatePaginationControlsUsers();
            });
        }
    }

    btnPreviousUsers.onclick = function () {
        if (pageNumberUsers >= 2) {
            pageNumberUsers--;
            window.scrollTo(0, 0);
            searchUsers(searchQuery).then(res => {
                showUsersSearchResults(res);
                updatePaginationControlsUsers();
            });
        }
    }

    // Paginação de repositórios do perfil selecionado
    btnNext.onclick = function () {
        const totalPages = Math.ceil(totalPublicRepos / count) || 1;
        if (pageNumber < totalPages) {
            pageNumber++;
            window.scrollTo(0, 0);

            getUser(user).then(res => {
                showProfile(res.profile);
                showRepos(res.repos);
                updatePaginationControls();
            });
        }
    }

    btnPrevious.onclick = function previousPage() {
        if (pageNumber >= 2) {
            pageNumber--;
            getUser(user).then(res => {
                showProfile(res.profile);
                showRepos(res.repos);
                updatePaginationControls();
            });
            window.scrollTo(0, 0);
        }
    }

    // Paginação filtrada
    btnNextFiltered.onclick = function () {
        const totalPagesFiltered = Math.ceil(totalFilteredRepos / count) || 1;
        if (pageNumberFiltered < totalPagesFiltered) {
            pageNumberFiltered++;
            window.scrollTo(0, 0);

            const filter = inputRepoFilter.value.trim();
            getReposFiltered(filter).then(res => {
                showReposFiltered(res.reposFiltered);
                updatePaginationControlsFiltered();
            });
        }
    }

    btnPreviousFiltered.onclick = function () {
        if (pageNumberFiltered >= 2) {
            pageNumberFiltered--;
            const filter = inputRepoFilter.value.trim();
            getReposFiltered(filter).then(res => {
                showReposFiltered(res.reposFiltered);
                updatePaginationControlsFiltered();
            });
            window.scrollTo(0, 0);
        }
    }

})();
