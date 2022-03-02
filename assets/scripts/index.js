(function () {
    const search = document.querySelector('.inputSearch');
    const profile = document.querySelector('#profile');

    const url = 'https://api.github.com';
    const client_id = 'a758c30ae6bd78739ead';
    const client_secret = 'e662535f645fa548b9ade32174b5d876e4f50c27';
    const count = 2;
    const sort = "created: asc";
    let user = '';

    const pagination = document.querySelector('#pagination');
    const paginationFiltered = document.querySelector('#paginationFiltered');
    const btnPrevious = document.querySelector('.btnPrevious');
    const btnNext = document.querySelector('.btnNext');
    const pageShowing = document.querySelector('.pageNumber');
    const btnPreviousFiltered = document.querySelector('.btnPreviousFiltered');
    const btnNextFiltered = document.querySelector('.btnNextFiltered');
    const pageShowingFiltered = document.querySelector('.pageNumberFiltered');
    let pageNumber = 1;
    let pageNumberFiltered = 1;

    const btnPesquisar = document.querySelector('.btnSearch');
    const btnFiltrar = document.querySelector('.btnFilter');

    search.focus();


    function pegaUsuario(user) {
        console.info(`****** pegaUsuario: "${user}" ******`);
        return user;
    };

    async function getUser(user) {
        console.log(`****** getUser: "${user}" ******\n`);

        const profileResponse = await fetch(
            `${url}/users/${user}?client_id=${client_id}&client_secret=${client_secret}`
        );

        const reposResponse = await fetch(
            `${url}/users/${user}/repos?per_page=${count}&sort=${sort}&client_id=${client_id}&client_secret=${client_secret}&page=${pageNumber}`
        );

        const profile = await profileResponse.json();
        const repos = await reposResponse.json();

        pegaUsuario(user);

        return { profile, repos };
    }

    async function getReposFiltered(reposName) {
        const reposResponse = await fetch(
            `${url}/search/repositories?q=${reposName}+in:name+user:${user}&per_page=${count}&sort=${sort}&client_id=${client_id}&client_secret=${client_secret}&page=${pageNumberFiltered}`
        );

        const reposFiltered = await reposResponse.json();

        return { reposFiltered };

    }


    function showProfile(user) {
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

    function showRepos(repos) {
        console.log(`ShowRepos: ${repos}`);
        let output = '';

        repos.forEach(repo => {
            output += /*<div id="repos">*/ `
            <div class="card flex">
                <a class="cardName" href="${repo.html_url}" target="_blank">${repo.name}</a>
                <div class="cardStatisticsGroup flex">
                    <span class="cardStatistic cardStar flex">
                        
                        <svg class="cardIcon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                            viewBox="0 0 172 172" style=" fill:#000000;">
                            <g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt"
                                stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0"
                                font-family="none" font-weight="none" font-size="none" text-anchor="none"
                                style="mix-blend-mode: normal">
                                <path d="M0,172v-172h172v172z" fill="none"></path>
                                <g fill="#00E676">
                                    <path d="M90.386,13.95493l16.48333,48.80213l51.50253,0.59627c4.43187,0.0516 6.26653,
                                5.69893 2.71187,8.342l-41.32013,30.7536l15.34813,49.16907c1.31867,4.2312 -3.48013,
                                7.71707 -7.09787,5.15427l-42.01387,-29.79613l-42.0196,29.7904c-3.612,2.5628 -8.41653,
                                -0.9288 -7.09787,-5.15427l15.34813,-49.16907l-41.32013,-30.7536c-3.55467,
                                -2.64307 -1.72,-8.2904 2.71187,-8.342l51.50253,-0.59627l16.48333,-48.80213c1.42187,
                                -4.1968 7.3616,-4.1968 8.77773,0.00573z">
                                    </path>
                                </g>
                            </g>
                        </svg>
                        <p class="starName">Star: <strong class="starCount">${repo.stargazers_count}</strong></p>
                    </span>
                    <span class="cardStatistic cardWatch flex">
                        <svg class="cardIcon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                            viewBox="0 0 172 172" style=" fill:#000000;">
                            <g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt"
                                stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0"
                                font-family="none" font-weight="none" font-size="none" text-anchor="none"
                                style="mix-blend-mode: normal">
                                <path d="M0,172v-172h172v172z" fill="none"></path>
                                <g fill="#eaeaea">
                                    <path d="M86,28.66667c-51.13157,0 -84.15967,52.81077 -84.75703,53.77239c-0.80406,
                                1.01283 -1.2421,2.26775 -1.24297,3.56094c0.00102,1.1094 0.32388,2.19467 0.92943,
                                3.12422c0.00743,0.01122 0.01489,0.02242 0.0224,0.03359c0.09858,0.20342 27.82281,
                                54.17552 85.04818,54.17552c56.98258,0 84.666,-53.44188 85.00339,-54.09714c0.02282,
                                -0.03707 0.04522,-0.0744 0.06719,-0.11198c0.60555,-0.92955 0.92841,-2.01482 0.92942,
                                -3.12422c-0.0002,-1.28802 -0.43411,-2.53845 -1.23177,-3.54974c-0.00373,
                                -0.00374 -0.00746,-0.00747 -0.0112,-0.0112c-0.59736,-0.96163 -33.62546,
                                -53.77239 -84.75703,-53.77239zM86,45.86667c22.16507,0 40.13333,17.96827 40.13333,
                                40.13333c0,22.16507 -17.96827,40.13333 -40.13333,40.13333c-22.16507,0 -40.13333,
                                -17.96827 -40.13333,-40.13333c0,-22.16507 17.96827,-40.13333 40.13333,
                                -40.13333zM86,68.8c-9.4993,0 -17.2,7.7007 -17.2,17.2c0,9.4993 7.7007,
                                17.2 17.2,17.2c9.4993,0 17.2,-7.7007 17.2,-17.2c0,-9.4993 -7.7007,-17.2 -17.2,
                                -17.2z">
                                    </path>
                                </g>
                            </g>
                        </svg>
                        <p class="watchName">Watch: <strong class="watchCount">${repo.watchers_count}</strong></p>
                    </span>
                    <span class="cardStatistic cardFork flex">
                        <svg class="cardIcon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                            viewBox="0 0 172 172" style=" fill:#000000;">
                            <g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt"
                                stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0"
                                font-family="none" font-weight="none" font-size="none" text-anchor="none"
                                style="mix-blend-mode: normal">
                                <path d="M0,172v-172h172v172z" fill="none"></path>
                                <g fill="#eaeaea">
                                    <path d="M50.16667,14.33333c-11.85367,0 -21.5,9.64633 -21.5,21.5c0,9.3282
                                6.01103,17.21533 14.33333,20.18424v51.48242v8.48242c-8.3223,2.96891 -14.33333,10.85605
                                -14.33333,20.18424c0,11.85367 9.64633,21.5 21.5,21.5c11.85367,0 21.5,-9.64633 21.5,-21.5c0,
                                -9.3282 -6.01103,-17.21533 -14.33333,-20.18424v-8.48242c0,-4.18055 1.98443,-6.52559 7.64258,
                                -9.82617c5.65815,-3.30059 14.33088,-6.22168 23.38965,-9.39225c9.05877,-3.17057 18.55352,-6.59496
                                26.44108,-12.24772c6.4158,-4.59799 11.72713,-11.35003 13.50749,-19.80632c8.67422,-2.76968 15.0192,
                                -10.81437 15.0192,-20.39421c0,-11.85367 -9.64633,-21.5 -21.5,-21.5c-11.85367,0 -21.5,9.64633 -21.5,21.5c0,
                                8.97257 5.5398,16.6595 13.36751,19.8763c-1.18324,3.3845 -3.49613,5.99768 -7.23665,8.67839c-5.54994,3.97745
                                -13.97185,7.2718 -22.82975,10.37207c-8.8579,3.10026 -18.10183,6.00208 -25.88119,10.54004c-0.14559,0.08492
                                -0.27494,0.20694 -0.41992,0.29394v-29.5765c8.3223,-2.96891 14.33333,-10.85604 14.33333,-20.18424c0,-11.85367
                                -9.64633,-21.5 -21.5,-21.5z">
                                    </path>
                                </g>
                            </g>
                        </svg>
                        <p class="forkName">Fork: <strong class="forkCount">${repo.forks_count}</strong></p>
                    </span>
                </div>
            </div>
            `;
        });
        document.querySelector('#repos').innerHTML = output;
    }

    function showReposFiltered(repos) {
        console.log(`ShowReposFiltered: ${repos}`);
        let output = '';

        repos.items.forEach(repo => {
            output += `
            <div class="card flex">
                <a class="cardName" href="${repo.html_url}" target="_blank">${repo.name}</a>
        
                <div class="cardStatisticsGroup flex">
        
                    <span class="cardStatistic cardStar flex">
                        
                        <svg class="cardIcon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                            viewBox="0 0 172 172" style=" fill:#000000;">
                            <g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt"
                                stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0"
                                font-family="none" font-weight="none" font-size="none" text-anchor="none"
                                style="mix-blend-mode: normal">
                                <path d="M0,172v-172h172v172z" fill="none"></path>
                                <g fill="#00E676">
                                    <path d="M90.386,13.95493l16.48333,48.80213l51.50253,0.59627c4.43187,0.0516 6.26653,
                                5.69893 2.71187,8.342l-41.32013,30.7536l15.34813,49.16907c1.31867,4.2312 -3.48013,
                                7.71707 -7.09787,5.15427l-42.01387,-29.79613l-42.0196,29.7904c-3.612,2.5628 -8.41653,
                                -0.9288 -7.09787,-5.15427l15.34813,-49.16907l-41.32013,-30.7536c-3.55467,
                                -2.64307 -1.72,-8.2904 2.71187,-8.342l51.50253,-0.59627l16.48333,-48.80213c1.42187,
                                -4.1968 7.3616,-4.1968 8.77773,0.00573z">
                                    </path>
                                </g>
                            </g>
                        </svg>
                        <p class="starName">Star: <strong class="starCount">${repo.stargazers_count}</strong></p>
                    </span>
        
                    <span class="cardStatistic cardWatch flex">
                        <svg class="cardIcon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                            viewBox="0 0 172 172" style=" fill:#000000;">
                            <g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt"
                                stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0"
                                font-family="none" font-weight="none" font-size="none" text-anchor="none"
                                style="mix-blend-mode: normal">
                                <path d="M0,172v-172h172v172z" fill="none"></path>
                                <g fill="#eaeaea">
                                    <path d="M86,28.66667c-51.13157,0 -84.15967,52.81077 -84.75703,53.77239c-0.80406,
                                1.01283 -1.2421,2.26775 -1.24297,3.56094c0.00102,1.1094 0.32388,2.19467 0.92943,
                                3.12422c0.00743,0.01122 0.01489,0.02242 0.0224,0.03359c0.09858,0.20342 27.82281,
                                54.17552 85.04818,54.17552c56.98258,0 84.666,-53.44188 85.00339,-54.09714c0.02282,
                                -0.03707 0.04522,-0.0744 0.06719,-0.11198c0.60555,-0.92955 0.92841,-2.01482 0.92942,
                                -3.12422c-0.0002,-1.28802 -0.43411,-2.53845 -1.23177,-3.54974c-0.00373,
                                -0.00374 -0.00746,-0.00747 -0.0112,-0.0112c-0.59736,-0.96163 -33.62546,
                                -53.77239 -84.75703,-53.77239zM86,45.86667c22.16507,0 40.13333,17.96827 40.13333,
                                40.13333c0,22.16507 -17.96827,40.13333 -40.13333,40.13333c-22.16507,0 -40.13333,
                                -17.96827 -40.13333,-40.13333c0,-22.16507 17.96827,-40.13333 40.13333,
                                -40.13333zM86,68.8c-9.4993,0 -17.2,7.7007 -17.2,17.2c0,9.4993 7.7007,
                                17.2 17.2,17.2c9.4993,0 17.2,-7.7007 17.2,-17.2c0,-9.4993 -7.7007,-17.2 -17.2,
                                -17.2z">
                                    </path>
                                </g>
                            </g>
                        </svg>
                        <p class="watchName">Watch: <strong class="watchCount">${repo.watchers_count}</strong></p>
                    </span>
        
                    <span class="cardStatistic cardFork flex">
                        <svg class="cardIcon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                            viewBox="0 0 172 172" style=" fill:#000000;">
                            <g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt"
                                stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0"
                                font-family="none" font-weight="none" font-size="none" text-anchor="none"
                                style="mix-blend-mode: normal">
                                <path d="M0,172v-172h172v172z" fill="none"></path>
                                <g fill="#eaeaea">
                                    <path d="M50.16667,14.33333c-11.85367,0 -21.5,9.64633 -21.5,21.5c0,9.3282
                                6.01103,17.21533 14.33333,20.18424v51.48242v8.48242c-8.3223,2.96891 -14.33333,10.85605
                                -14.33333,20.18424c0,11.85367 9.64633,21.5 21.5,21.5c11.85367,0 21.5,-9.64633 21.5,-21.5c0,
                                -9.3282 -6.01103,-17.21533 -14.33333,-20.18424v-8.48242c0,-4.18055 1.98443,-6.52559 7.64258,
                                -9.82617c5.65815,-3.30059 14.33088,-6.22168 23.38965,-9.39225c9.05877,-3.17057 18.55352,-6.59496
                                26.44108,-12.24772c6.4158,-4.59799 11.72713,-11.35003 13.50749,-19.80632c8.67422,-2.76968 15.0192,
                                -10.81437 15.0192,-20.39421c0,-11.85367 -9.64633,-21.5 -21.5,-21.5c-11.85367,0 -21.5,9.64633 -21.5,21.5c0,
                                8.97257 5.5398,16.6595 13.36751,19.8763c-1.18324,3.3845 -3.49613,5.99768 -7.23665,8.67839c-5.54994,3.97745
                                -13.97185,7.2718 -22.82975,10.37207c-8.8579,3.10026 -18.10183,6.00208 -25.88119,10.54004c-0.14559,0.08492
                                -0.27494,0.20694 -0.41992,0.29394v-29.5765c8.3223,-2.96891 14.33333,-10.85604 14.33333,-20.18424c0,-11.85367
                                -9.64633,-21.5 -21.5,-21.5z">
                                    </path>
                                </g>
                            </g>
                        </svg>
                        <p class="forkName">Fork: <strong class="forkCount">${repo.forks_count}</strong></p>
                    </span>
        
                </div>
        
            </div>
            `;
        });

        document.querySelector('#repos').innerHTML = output;
    }

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


    btnPesquisar.onclick = function () {
        user = search.value;
        function pesquisaUsuario() {
            getUser(user).then(res => {
                console.log(`****** User btnPesquisar: "${res.profile.login}" ******\n`);
                showProfile(res.profile);
                showRepos(res.repos);
            });
        };
        pesquisaUsuario();

        search.value = '';
        search.focus();

        pageNumberFiltered = 1;
        pageNumber = 1;

        pageShowing.innerHTML = pageNumber;
        pagination.classList.remove("hidden");
        paginationFiltered.classList.add('hidden');

    }


    btnFiltrar.onclick = function () {
        const filter = search.value;
        const Usuario = pegaUsuario(user);

        function filtraRepos() {
            console.log(`****** User btnFiltrar: "${Usuario}" ******\n`);
            clearRepos();

            getReposFiltered(filter).then(res => {
                showReposFiltered(res.reposFiltered);
            });
        };
        filtraRepos();
        pageNumberFiltered = 1;
        pageNumber = 1;

        pageShowingFiltered.innerHTML = pageNumberFiltered;
        pagination.classList.add('hidden');
        paginationFiltered.classList.remove('hidden');
    }

    btnNext.onclick = function() {
        pageNumber++;
        function pesquisaUsuario() {
            getUser(user).then(res => {
                console.log(`****** User btnNext: "${res.profile.login}" ******\n`);
                showProfile(res.profile);
                showRepos(res.repos);
            });
        };
        pesquisaUsuario();
        pageShowing.innerHTML = pageNumber;
    }

    btnPrevious.onclick = function previousPage(){
        pageNumber--;
        function pesquisaUsuario() {
            getUser(user).then(res => {
                console.log(`****** User btnPrevious: "${res.profile.login}" ******\n`);
                showProfile(res.profile);
                showRepos(res.repos);
            });
        };
        pesquisaUsuario();
        pageShowing.innerHTML = pageNumber;
    }

    btnNextFiltered.onclick = function(){
        pageNumberFiltered++;
        const filter = search.value;
        const Usuario = pegaUsuario(user);

        function filtraRepos() {
            console.log(`****** User btnNextFiltered: "${Usuario}" ******\n`);
            clearRepos();

            getReposFiltered(filter).then(res => {
                showReposFiltered(res.reposFiltered);
            });
        };
        filtraRepos();

        pageShowingFiltered.innerHTML = pageNumberFiltered;
    }

    btnPreviousFiltered.onclick = function(){
        pageNumberFiltered--;
        const filter = search.value;
        const Usuario = pegaUsuario(user);

        function filtraRepos() {
            console.log(`****** User btnPreviousFiltered: "${Usuario}" ******\n`);
            clearRepos();

            getReposFiltered(filter).then(res => {
                showReposFiltered(res.reposFiltered);
            });
        };
        filtraRepos();

        pageShowingFiltered.innerHTML = pageNumberFiltered;
    }

    

})();