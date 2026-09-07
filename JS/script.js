/* =========================================================
/* 1. LISTA DE PRODUTOS*/
const products = [

    {
        id: 1,
        name: "Scoop Aurora Dourado",
        category: "dourado",
        price: 39.90,
        description:
            "Pacote surpresa com adereços de aço em acabamento dourado.",
        symbol: "✦",
        colorClass: ""
    },

    {
        id: 2,
        name: "Scoop Lua Prateada",
        category: "prateado",
        price: 34.90,
        description:
            "Seleção de acessórios de aço em acabamento prateado.",
        symbol: "☾",
        colorClass: "silver"
    },

    {
        id: 3,
        name: "Scoop Encanto Lilás",
        category: "misto",
        price: 44.90,
        description:
            "Mix surpresa com possibilidades de brincos, anéis e colares.",
        symbol: "✧",
        colorClass: "mixed"
    },

    {
        id: 4,
        name: "Scoop Dourado Premium",
        category: "dourado",
        price: 59.90,
        description:
            "Scoop especial com seleção premium de peças douradas.",
        symbol: "◆",
        colorClass: ""
    },

    {
        id: 5,
        name: "Scoop Prata Estelar",
        category: "prateado",
        price: 49.90,
        description:
            "Acessórios prateados inspirados em uma coleção celestial.",
        symbol: "☆",
        colorClass: "silver"
    },

    {
        id: 6,
        name: "Scoop Duo Violeta",
        category: "misto",
        price: 54.90,
        description:
            "Combinação de acessórios dourados e prateados.",
        symbol: "◇",
        colorClass: "mixed"
    },

    {
        id: 7,
        name: "Scoop Rosé Chic",
        category: "dourado",
        price: 42.90,
        description:
            "Pacote delicado para quem gosta de detalhes marcantes.",
        symbol: "♡",
        colorClass: ""
    },

    {
        id: 8,
        name: "Scoop Prata Crystal",
        category: "prateado",
        price: 46.90,
        description:
            "Seleção prateada com visual elegante e versátil.",
        symbol: "✧",
        colorClass: "silver"
    }

];


/* =========================================================
   2. ESTADO DA APLICAÇÃO
   =========================================================

   O objeto "state" guarda informações que mudam durante
   a utilização do site.

   category -> categoria atualmente selecionada
   search   -> texto digitado na pesquisa
   cart     -> produtos adicionados ao carrinho
   user     -> usuário atualmente conectado

   localStorage permite manter algumas dessas informações
   mesmo depois que o navegador é fechado.
   ========================================================= */

const state = {

    category: "todos",

    search: "",

    cart: JSON.parse(
        localStorage.getItem("scartemisCart") || "[]"
    ),

    user: JSON.parse(
        localStorage.getItem("scartemisUser") || "null"
    )

};


/* =========================================================
   3. FUNÇÕES AUXILIARES
   ========================================================= */

/*
   Função "$"

   Facilita a seleção de elementos HTML.

   Exemplo:

   $("#productGrid")

   equivale a:

   document.querySelector("#productGrid")
*/

const $ = (selector, root = document) =>
    root.querySelector(selector);


/*
   Função "$$"

   Retorna todos os elementos que correspondem ao seletor.

   O resultado é convertido para Array para facilitar
   o uso de métodos como forEach().
*/

const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];


/*
   Formata valores numéricos como moeda brasileira.

   Exemplo:

   money(39.9)

   retorna:

   R$ 39,90
*/

const money = value =>
    value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });


/*
   Procura um produto pelo seu ID.

   Number(id) transforma o valor recebido em número.
*/

const productById = id =>
    products.find(product =>
        product.id === Number(id)
    );


/* =========================================================
   4. ARMAZENAMENTO DO CARRINHO
   ========================================================= */

/*
   Salva o carrinho no localStorage.

   JSON.stringify transforma o array em texto para que
   ele possa ser armazenado pelo navegador.
*/

function saveCart() {

    localStorage.setItem(
        "scartemisCart",
        JSON.stringify(state.cart)
    );

}


/* =========================================================
   5. SISTEMA DE NOTIFICAÇÕES
   =========================================================

   Exibe uma pequena mensagem na tela para informar
   o usuário sobre alguma ação realizada.
   ========================================================= */

function toast(message) {

    const element = $("#toast");

    if (!element) return;

    element.textContent = message;

    element.classList.add("show");

    /*
       Cancela uma mensagem anterior caso exista.
    */

    clearTimeout(toast.timer);

    /*
       Remove a mensagem depois de 2,8 segundos.
    */

    toast.timer = setTimeout(() => {

        element.classList.remove("show");

    }, 2800);

}


/* =========================================================
   RENDERIZAÇÃO DOS PRODUTOS
   ========================================================= */

/*
 * Esta função:
 * 1. Busca a área onde os produtos serão exibidos;
 * 2. Aplica o filtro de categoria;
 * 3. Aplica a pesquisa;
 * 4. Cria os cards dos produtos;
 * 5. Ativa os botões "Adicionar" e "Ver detalhes".
 */
function renderProducts() {

    // Localiza a grade de produtos no HTML.
    const grid = $("#productGrid");

    // Localiza a mensagem de produto não encontrado.
    const empty = $("#emptyState");

    // Se a grade não existir, não há nada para renderizar.
    if (!grid) return;

    /*
     * Filtra os produtos de acordo com:
     * - categoria selecionada;
     * - texto digitado na busca.
     */
    const list = products.filter(product => {

        const matchesCategory =
            state.category === "todos" ||
            product.category === state.category;

        const matchesSearch =
            product.name
                .toLowerCase()
                .includes(state.search.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    /*
     * Cria os cards dos produtos.
     */
    grid.innerHTML = list.map(product => `

        <article class="product-card">

            <!-- Área visual do produto -->
            <div
                class="product-thumb"
                aria-hidden="true">

                <div
                    class="product-symbol ${product.colorClass}">

                    ${product.symbol}

                </div>

            </div>


            <!-- Informações do produto -->
            <div class="product-body">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3>
                    ${product.name}
                </h3>

                <p class="product-description">
                    ${product.description}
                </p>

                <div class="product-price">
                    ${money(product.price)}
                </div>


                <!-- Botões -->
                <div class="product-actions">

                    <button
                        class="button primary add-cart"
                        type="button"
                        data-id="${product.id}">
                        Adicionar
                    </button>

                    <button
                        class="button secondary detail-button"
                        type="button"
                        data-detail-id="${product.id}">
                        Ver detalhes
                    </button>

                </div>

            </div>

        </article>

    `).join("");


    /*
     * Mostra ou esconde a mensagem
     * "Nenhum produto encontrado".
     */
    if (empty) {

        empty.hidden = list.length > 0;

    }


    /* =====================================================
       BOTÕES "ADICIONAR"
       ===================================================== */

    $$(".add-cart").forEach(button => {

        button.addEventListener("click", () => {

            const id =
                Number(button.dataset.id);

            addToCart(id);

        });

    });


    /* =====================================================
       BOTÕES "VER DETALHES"
       ===================================================== */

    $$(".detail-button").forEach(button => {

        button.addEventListener("click", () => {

            const id =
                Number(button.dataset.detailId);

            openProductModal(id);

        });

    });

}

/* =========================================
   ABRIR MODAL DE DETALHES
   ========================================= */

function openProductModal(id) {

    // Procura o produto pelo ID.
    const product = productById(id);

    // Se o produto não existir, interrompe a função.
    if (!product) return;

    // Obtém os elementos do modal.
    const modal = $("#productModal");
    const title = $("#productModalTitle");
    const category = $("#productModalCategory");
    const description = $("#productModalDescription");
    const price = $("#productModalPrice");
    const art = $("#productModalArt");

    // Se o modal não existir na página, interrompe.
    if (!modal) return;

    /*
       Preenche as informações do produto.
    */
    title.textContent = product.name;

    category.textContent = product.category;

    description.textContent = product.description;

    price.textContent = money(product.price);

    /*
       Cria a representação visual do produto.
    */
    art.innerHTML = `
        <div class="product-symbol ${product.colorClass}">
            ${product.symbol}
        </div>
    `;

    /*
       Guarda o ID do produto no botão.
       Assim sabemos qual produto adicionar
       caso o cliente clique em "Adicionar".
    */
    $("#modalAddCart").dataset.id = product.id;

    /*
       Exibe o modal.
    */
    modal.hidden = false;

    /*
       Impede que a página continue rolando
       enquanto o modal estiver aberto.
    */
    document.body.classList.add("modal-open");

    /*
       Coloca o foco no botão de fechar.
       Isso melhora a acessibilidade.
    */
    $("#closeProductModal")?.focus();
}

/* =========================================
   FECHAR MODAL DE DETALHES
   ========================================= */

function closeProductModal() {

    // Obtém o modal.
    const modal = $("#productModal");

    // Se não existir, interrompe.
    if (!modal) return;

    // Esconde o modal.
    modal.hidden = true;

    /*
       Libera novamente o rolamento da página.
    */
    document.body.classList.remove("modal-open");
}

/* =========================================================
   7. ADICIONAR PRODUTO AO CARRINHO
   ========================================================= */

function addToCart(id) {

    /*
       Verifica se o produto já está no carrinho.
    */

    const item = state.cart.find(
        product => product.id === id
    );


    /*
       Se já estiver no carrinho,
       aumenta a quantidade.
    */

    if (item) {

        item.quantity++;

    }

    /*
       Caso ainda não esteja,
       adiciona um novo item.
    */

    else {

        state.cart.push({
            id: id,
            quantity: 1
        });

    }


    /*
       Salva as alterações.
    */

    saveCart();


    /*
       Atualiza visualmente o carrinho.
    */

    updateCart();


    /*
       Informa o usuário.
    */

    toast("Produto adicionado ao carrinho.");

}


/* =========================================================
   8. ALTERAR QUANTIDADE DO PRODUTO
   ========================================================= */

function changeQuantity(id, delta) {

    /*
       Procura o produto dentro do carrinho.
    */

    const item = state.cart.find(
        product => product.id === id
    );


    if (!item) return;


    /*
       Soma ou diminui a quantidade.
    */

    item.quantity += delta;


    /*
       Se a quantidade chegar a zero,
       remove o produto do carrinho.
    */

    if (item.quantity <= 0) {

        state.cart =
            state.cart.filter(
                product => product.id !== id
            );

    }


    saveCart();

    updateCart();

}


/* =========================================================
   9. CALCULAR TOTAL DO CARRINHO
   ========================================================= */

function cartTotal() {

    return state.cart.reduce(
        (total, item) => {

            const product =
                productById(item.id);


            /*
               Se o produto existir,
               multiplica preço pela quantidade.
            */

            return total +
                (
                    product
                        ? product.price * item.quantity
                        : 0
                );

        },

        0
    );

}


/* =========================================================
   10. ATUALIZAR CARRINHO
   ========================================================= */

function updateCart() {

    const count = $("#cartCount");

    const box = $("#cartItems");

    const total = $("#cartTotal");


    if (!count) return;


    /*
       Calcula a quantidade total de produtos.
    */

    count.textContent =
        state.cart.reduce(
            (sum, item) =>
                sum + item.quantity,
            0
        );


    /*
       Cria os produtos dentro do carrinho.
    */

    if (box) {

        if (state.cart.length) {

            box.innerHTML =
                state.cart.map(item => {

                    const product =
                        productById(item.id);


                    /*
                       Evita problemas caso um produto
                       não seja encontrado.
                    */

                    if (!product) return "";


                    return `

                        <div class="cart-item">

                            <div
                                class="cart-item-thumb"
                                aria-hidden="true"
                            >
                                ${product.symbol}
                            </div>


                            <div>

                                <h3>
                                    ${product.name}
                                </h3>


                                <p>
                                    ${money(product.price)}
                                </p>


                                <!-- Controle de quantidade -->

                                <div class="qty-controls">

                                    <button
                                        type="button"
                                        data-minus="${product.id}"
                                        aria-label="Diminuir quantidade"
                                    >
                                        −
                                    </button>


                                    <strong>
                                        ${item.quantity}
                                    </strong>


                                    <button
                                        type="button"
                                        data-plus="${product.id}"
                                        aria-label="Aumentar quantidade"
                                    >
                                        +
                                    </button>

                                </div>

                            </div>


                            <!-- Subtotal do produto -->

                            <strong>
                                ${money(
                                    product.price *
                                    item.quantity
                                )}
                            </strong>

                        </div>

                    `;

                }).join("");

        }

        else {

            box.innerHTML = `

                <p class="empty-state">
                    Seu carrinho está vazio.
                </p>

            `;

        }

    }


    /*
       Eventos dos botões de diminuir quantidade.
    */

    $$("#cartItems [data-minus]").forEach(button => {

        button.addEventListener("click", () => {

            changeQuantity(
                Number(button.dataset.minus),
                -1
            );

        });

    });


    /*
       Eventos dos botões de aumentar quantidade.
    */

    $$("#cartItems [data-plus]").forEach(button => {

        button.addEventListener("click", () => {

            changeQuantity(
                Number(button.dataset.plus),
                1
            );

        });

    });


    /*
       Atualiza o valor total.
    */

    if (total) {

        total.textContent =
            money(cartTotal());

    }

}


/* =========================================================
   11. ABRIR CARRINHO
   ========================================================= */

function openCart() {

    const drawer = $("#cartDrawer");

    const backdrop = $("#drawerBackdrop");


    if (!drawer) return;


    drawer.classList.add("open");

    drawer.setAttribute(
        "aria-hidden",
        "false"
    );


    if (backdrop) {

        backdrop.hidden = false;

    }


    /*
       Impede o rolamento da página enquanto o
       carrinho estiver aberto.
    */

    document.body.classList.add("modal-open");

}


/* =========================================================
   12. FECHAR CARRINHO
   ========================================================= */

function closeCart() {

    const drawer = $("#cartDrawer");

    const backdrop = $("#drawerBackdrop");


    if (!drawer) return;


    drawer.classList.remove("open");

    drawer.setAttribute(
        "aria-hidden",
        "true"
    );


    if (backdrop) {

        backdrop.hidden = true;

    }


    document.body.classList.remove(
        "modal-open"
    );

}


/* =========================================================
   13. LOGIN E CADASTRO
   ========================================================= */

/*
   Atualiza o texto do botão de conta.

   Sem usuário:

   Entrar

   Com usuário:

   Olá, Nome
*/

function updateAccountButton() {

    const button =
        $("#accountButton");


    if (!button) return;


    if (state.user) {

        button.textContent =
            `Olá, ${state.user.name.split(" ")[0]}`;

    }

    else {

        button.textContent =
            "Entrar";

    }

}


/* =========================================================
   14. ABRIR MODAL DA CONTA
   ========================================================= */

function openAccount(){
    const modal = $("#accountModal");

    if (!modal) return;

    // Sempre abre a conta inicialmente na tela de login
    setAccountTab("login");

    // Mostra o modal
    modal.hidden = false;

    // Impede a rolagem da página enquanto o modal estiver aberto
    document.body.classList.add("modal-open");

    // Coloca o cursor no campo de e-mail
    setTimeout(() => {
        $("#loginEmail")?.focus();
    }, 0);
}


/* =========================================================
   15. FECHAR MODAL DA CONTA
   ========================================================= */

function closeAccount() {

    const modal =
        $("#accountModal");


    if (!modal) return;


    modal.hidden = true;


    document.body.classList.remove(
        "modal-open"
    );

}

/* =====================================================
   ALTERNA ENTRE LOGIN E CADASTRO
===================================================== */

function setAccountTab(name){
    const login = $("#loginForm");
    const register = $("#registerForm");

    if (!login || !register) return;

    // Verifica qual aba deve aparecer
    const showLogin = name === "login";

    // Mostra apenas o formulário escolhido
    login.hidden = !showLogin;
    register.hidden = showLogin;

    // Garante que o CSS também respeite a exibição
    login.style.display = showLogin ? "grid" : "none";
    register.style.display = showLogin ? "none" : "grid";

    // Atualiza visualmente as abas
    $$("[data-account-tab]").forEach(button => {
        const active = button.dataset.accountTab === name;

        button.classList.toggle("active", active);
        button.setAttribute("aria-selected", active ? "true" : "false");
    });

    // Limpa mensagens anteriores
    const message = $("#accountMessage");

    if (message) {
        message.textContent = "";
    }

    // Coloca o cursor no primeiro campo do formulário
    const firstInput = showLogin
        ? $("#loginEmail")
        : $("#registerName");

    firstInput?.focus();
}

/* =========================================================
   17. CADASTRAR USUÁRIO
   ========================================================= */

function registerUser(event) {

    event.preventDefault();


    /*
       Obtém os dados digitados.
    */

    const name =
        $("#registerName")
            .value
            .trim();


    const email =
        $("#registerEmail")
            .value
            .trim()
            .toLowerCase();


    const password =
        $("#registerPassword")
            .value;


    /*
       Salva os dados da conta.

       ATENÇÃO:
       Este é apenas um sistema demonstrativo.
       Em uma aplicação real, senhas não devem ser
       armazenadas dessa maneira no localStorage.
    */

    localStorage.setItem(
        "scartemisAccount",
        JSON.stringify({
            name,
            email,
            password
        })
    );


    /*
       Define o usuário como conectado.
    */

    state.user = {
        name,
        email
    };


    localStorage.setItem(
        "scartemisUser",
        JSON.stringify(state.user)
    );


    $("#accountMessage").textContent =
        "Cadastro realizado! Você já está conectado.";


    updateAccountButton();


    /*
       Fecha o modal depois de um pequeno intervalo.
    */

    setTimeout(
        closeAccount,
        900
    );

}


/* =========================================================
   18. LOGIN
   ========================================================= */

function loginUser(event) {

    event.preventDefault();


    const email =
        $("#loginEmail")
            .value
            .trim()
            .toLowerCase();


    const password =
        $("#loginPassword")
            .value;


    /*
       Recupera a conta salva.
    */

    const account =
        JSON.parse(
            localStorage.getItem(
                "scartemisAccount"
            ) || "null"
        );


    /*
       Verifica se os dados estão corretos.
    */

    if (
        !account ||
        account.email !== email ||
        account.password !== password
    ) {

        $("#accountMessage").textContent =
            "E-mail ou senha incorretos.";

        return;

    }


    /*
       Define o usuário como conectado.
    */

    state.user = {

        name: account.name,

        email: account.email

    };


    localStorage.setItem(
        "scartemisUser",
        JSON.stringify(state.user)
    );


    $("#accountMessage").textContent =
        `Bem-vindo(a), ${account.name}!`;


    updateAccountButton();


    setTimeout(
        closeAccount,
        900
    );

}


/* =========================================================
   19. SAIR DA CONTA
   ========================================================= */

function logoutUser() {

    state.user = null;


    localStorage.removeItem(
        "scartemisUser"
    );


    updateAccountButton();


    toast(
        "Você saiu da sua conta."
    );

}


/* =====================================================
   INICIALIZAÇÃO DO TEMA
===================================================== */

function initTheme() {

    /*
        Primeiro verifica se o usuário
        já escolheu um tema anteriormente.
    */

    const savedTheme =
        localStorage.getItem("scartemisTheme");


    /*
        Caso não exista preferência salva,
        verifica a configuração do sistema.
    */

    if (savedTheme) {

        document.documentElement.dataset.theme =
            savedTheme;

    } else {

        const systemDark =
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;

        document.documentElement.dataset.theme =
            systemDark ? "dark" : "light";

    }


    updateThemeButton();
}


/*
   Atualiza o ícone do botão de tema.
*/

function updateThemeButton() {

    const button =
        $("#themeButton");


    if (!button) return;


    const dark =
        document.documentElement.dataset.theme === "dark";


    button.textContent =
        dark ? "☀" : "☾";


    button.setAttribute(
        "aria-label",
        dark
            ? "Ativar modo claro"
            : "Ativar modo escuro"
    );

}


/*
   Alterna entre os temas.
*/

function toggleTheme() {

    const next =
        document.documentElement.dataset.theme === "dark"
            ? "light"
            : "dark";


    document.documentElement.dataset.theme =
        next;


    localStorage.setItem(
        "scartemisTheme",
        next
    );


    updateThemeButton();

}


/* =========================================================
   21. PÁGINA DE DETALHES DO PRODUTO
   =========================================================

   Esta função é executada somente quando existe no HTML
   um elemento com:

   id="productDetail"

   O ID do produto é obtido pela URL.

   Exemplo:

   produto.html?id=3
   ========================================================= */

function renderProductDetail() {

    const box =
        $("#productDetail");


    /*
       Se não existir a área de detalhes,
       significa que estamos na página principal.
    */

    if (!box) return;


    /*
       Obtém o ID enviado pela URL.
    */

    const id =
        new URLSearchParams(
            location.search
        ).get("id");


    /*
       Procura o produto correspondente.

       Caso não encontre, utiliza o primeiro produto
       como alternativa.
    */

    const product =
        productById(id) ||
        products[0];


    /*
       Monta a página de detalhes.
    */

    box.innerHTML = `

        <div class="product-detail">


            <!-- Representação visual -->

            <div
                class="product-detail-art"
                aria-label="Representação visual do produto"
            >

                <div
                    class="product-symbol ${product.colorClass}"
                >
                    ${product.symbol}
                </div>

            </div>


            <!-- Informações do produto -->

            <div class="product-detail-copy">

                <p class="eyebrow">
                    ${product.category}
                </p>


                <h1>
                    ${product.name}
                </h1>


                <p>
                    ${product.description}
                </p>


                <p>
                    Este scoop foi pensado para proporcionar
                    uma experiência de descoberta de acessórios
                    em aço, podendo incluir pulseiras, brincos,
                    anéis, colares e outros adereços.
                </p>


                <div class="detail-price">
                    ${money(product.price)}
                </div>


                <button
                    class="button primary"
                    id="detailAdd"
                    type="button"
                >
                    Adicionar ao carrinho
                </button>

            </div>

        </div>

    `;


    /*
       Evento do botão de adicionar ao carrinho
       na página de detalhes.
    */

    $("#detailAdd").addEventListener(
        "click",
        () => {

            addToCart(product.id);

            openCart();

        }
    );

}

/* =====================================================
    ACESSIBILIDADE
    ===================================================== */


    /*
        Tamanho atual do texto.
        100 = tamanho normal.
    */

    let textScale =
        Number(localStorage.getItem("scartemisTextScale")) || 100;


    /* =====================================================
    APLICA O TAMANHO DO TEXTO
    ===================================================== */

    function applyTextScale() {

        document.documentElement.style.fontSize =
            `${textScale}%`;

        localStorage.setItem(
            "scartemisTextScale",
            textScale
        );
    }


    /* =====================================================
    AUMENTAR TEXTO
    ===================================================== */

    function increaseText() {

        if (textScale < 150) {

            textScale += 10;

            applyTextScale();

        }
    }


    /* =====================================================
    DIMINUIR TEXTO
    ===================================================== */

    function decreaseText() {

        if (textScale > 80) {

            textScale -= 10;

            applyTextScale();

        }
    }


    /* =====================================================
    RESTAURAR TAMANHO
    ===================================================== */

    function resetAccessibility() {

        textScale = 100;

        applyTextScale();

        document.body.classList.remove(
            "high-contrast"
        );

        localStorage.removeItem(
            "scartemisHighContrast"
        );
    }


    /* =====================================================
    ALTO CONTRASTE
    ===================================================== */

    function toggleHighContrast() {

        const active =
            document.body.classList.toggle(
                "high-contrast"
            );

        localStorage.setItem(
            "scartemisHighContrast",
            active
        );
    }


    /* =====================================================
    RESTAURA ACESSIBILIDADE SALVA
    ===================================================== */

    function initAccessibility() {

        applyTextScale();

        const contrast =
            localStorage.getItem(
                "scartemisHighContrast"
            );

        if (contrast === "true") {

            document.body.classList.add(
                "high-contrast"
            );

        }
    }


    /* =====================================================
    LEITOR DE TELA / LEITURA DA PÁGINA
    ===================================================== */

    function readPage() {

        /*
            Verifica se o navegador oferece
            a API de síntese de voz.
        */

        if (!("speechSynthesis" in window)) {

            toast(
                "A leitura de voz não é compatível com este navegador."
            );

            return;
        }


        // Para qualquer leitura anterior
        speechSynthesis.cancel();


        /*
            Pega o conteúdo principal da página.
        */

        const content =
            document.querySelector("main");


        if (!content) {
            return;
        }


        /*
            Obtém apenas o texto da página.
        */

        const text =
            content.innerText;


        /*
            Cria uma nova fala.
        */

        const speech =
            new SpeechSynthesisUtterance(text);


        speech.lang = "pt-BR";

        speech.rate = 1;

        speech.pitch = 1;

        speech.volume = 1;


        speechSynthesis.speak(speech);
    }


    /* =====================================================
    PARAR LEITURA
    ===================================================== */

    function stopReading() {

        if ("speechSynthesis" in window) {

            speechSynthesis.cancel();

        }
    }

/* =========================================================
   22. INICIALIZAÇÃO DA APLICAÇÃO
   =========================================================

   DOMContentLoaded garante que o JavaScript só execute
   depois que o HTML tiver sido carregado.
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

            /* =========================================
       EVENTOS DO MODAL DE PRODUTO
       ========================================= */

        /*
        Clique no botão "Ver detalhes".
        */
        $$("#productGrid .detail-button").forEach(button => {

            button.addEventListener("click", () => {

                const id = Number(button.dataset.detailId);

                openProductModal(id);

            });

        });


        /*
        Fechar o modal pelo botão X.
        */
        $("#closeProductModal")?.addEventListener(
            "click",
            closeProductModal
        );


        /*
        Fechar o modal pelo botão
        "Continuar comprando".
        */
        $("#modalContinue")?.addEventListener(
            "click",
            closeProductModal
        );


        /*
        Adicionar o produto ao carrinho
        diretamente pelo modal.
        */
        $("#modalAddCart")?.addEventListener(
            "click",
            () => {

                const id = Number(
                    $("#modalAddCart").dataset.id
                );

                if (!id) return;

                addToCart(id);

                closeProductModal();

                openCart();

            }
        );


        /*
        Permite fechar o modal clicando
        fora da caixa de informações.
        */
        $("#productModal")?.addEventListener(
            "click",
            event => {

                if (event.target === event.currentTarget) {

                    closeProductModal();

                }

            }
        );


        /* -----------------------------------------
           Inicialização geral
           ----------------------------------------- */

        initTheme();

        renderProducts();

        renderProductDetail();

        updateCart();

        updateAccountButton();


        /* -----------------------------------------
           TEMA
           ----------------------------------------- */

        $("#themeButton")?.addEventListener(
            "click",
            toggleTheme
        );


        /* -----------------------------------------
           CARRINHO
           ----------------------------------------- */

        $("#cartButton")?.addEventListener(
            "click",
            openCart
        );


        $("#closeCart")?.addEventListener(
            "click",
            closeCart
        );


        $("#drawerBackdrop")?.addEventListener(
            "click",
            closeCart
        );


        /*
           Limpar carrinho
        */

        $("#clearCart")?.addEventListener(
            "click",
            () => {

                state.cart = [];

                saveCart();

                updateCart();

                toast(
                    "Carrinho limpo."
                );

            }
        );


        /*
           Finalização do pedido.

           Atualmente é apenas uma demonstração.
           Em um ecommerce real, este botão deverá
           ser conectado a um sistema de pagamento.
        */

        $("#checkoutButton")?.addEventListener(
            "click",
            () => {

                toast(
                    state.cart.length
                        ? "Demonstração: aqui será conectado o checkout/pagamento."
                        : "Adicione algum produto antes de finalizar."
                );

            }
        );


        /* -----------------------------------------
           CONTA
           ----------------------------------------- */

        $("#accountButton")?.addEventListener(
            "click",
            () => {

                /*
                   Se já estiver conectado,
                   pergunta se deseja sair.

                   Caso contrário, abre o login.
                */

                if (state.user) {

                    const logout =
                        confirm(
                            `Você está conectado como ${state.user.name}. Deseja sair?`
                        );


                    if (logout) {

                        logoutUser();

                    }

                }

                else {

                    openAccount();

                }

            }
        );


        /*
           Fecha o modal ao clicar no fundo.
        */

        $("#accountModal")?.addEventListener(
            "click",
            event => {

                if (
                    event.target === event.currentTarget
                ) {

                    closeAccount();

                }

            }
        );


        /*
           Botões que possuem data-close.
        */

        $$("[data-close]").forEach(button => {

            button.addEventListener("click", () => {

                const modalId = button.dataset.close;

                const modal = document.getElementById(modalId);

                if (modal) {
                    modal.hidden = true;
                }

                document.body.classList.remove("modal-open");

            });

        });


        /*
           Abas Entrar / Criar conta.
        */

        $$("[data-account-tab]").forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        setAccountTab(
                            button.dataset.accountTab
                        );

                    }
                );

            }
        );


        /*
           Formulário de login.
        */

        $("#loginForm")?.addEventListener(
            "submit",
            loginUser
        );


        /*
           Formulário de cadastro.
        */

        $("#registerForm")?.addEventListener(
            "submit",
            registerUser
        );


        /* -----------------------------------------
           FILTROS DE PRODUTOS
           ----------------------------------------- */

        $$(".filter").forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        /*
                           Atualiza a categoria.
                        */

                        state.category =
                            button.dataset.category;


                        /*
                           Remove "active" de todos
                           os filtros.
                        */

                        $$(".filter").forEach(
                            filter =>
                                filter.classList.remove(
                                    "active"
                                )
                        );


                        /*
                           Ativa o filtro selecionado.
                        */

                        button.classList.add(
                            "active"
                        );


                        /*
                           Atualiza os produtos.
                        */

                        renderProducts();

                    }
                );

            }
        );


        /* -----------------------------------------
           PESQUISA DE PRODUTOS
           ----------------------------------------- */

        $("#productSearch")?.addEventListener(
            "input",
            event => {

                /*
                   Atualiza o texto pesquisado.
                */

                state.search =
                    event.target.value;


                /*
                   Atualiza os cards.
                */

                renderProducts();

            }
        );


        /* -----------------------------------------
           MENU RESPONSIVO
           ----------------------------------------- */

        $("#menuButton")?.addEventListener(
            "click",
            () => {

                const nav =
                    $("#mainNav");


                /*
                   Adiciona ou remove a classe "open".
                */

                const open =
                    nav.classList.toggle(
                        "open"
                    );


                /*
                   Atualiza o atributo de acessibilidade.
                */

                $("#menuButton").setAttribute(
                    "aria-expanded",
                    open
                );

            }
        );


        /*
           Fecha o menu depois que o usuário
           seleciona uma opção.
        */

        $$(".main-nav a").forEach(
            link => {

                link.addEventListener(
                    "click",
                    () => {

                        $("#mainNav")
                            ?.classList.remove(
                                "open"
                            );


                        $("#menuButton")
                            ?.setAttribute(
                                "aria-expanded",
                                "false"
                            );

                    }
                );

            }
        );


        /* -----------------------------------------
           TECLA ESC
           -----------------------------------------

           Permite fechar o carrinho ou modal
           utilizando a tecla ESC.
        */

        document.addEventListener(
            "keydown",
            event => {

                if (event.key === "Escape") {

                    closeCart();

                    closeAccount();

                    closeProductModal();

                }

            }
        );

        /* =====================================================
        ACESSIBILIDADE
        ===================================================== */

        const accessibilityButton =
            $("#accessibilityButton");

        const accessibilityPanel =
            $("#accessibilityPanel");


        /*
            Abre e fecha o painel.
        */

        accessibilityButton?.addEventListener(
            "click",
            () => {

                const isOpen =
                    !accessibilityPanel.hidden;

                accessibilityPanel.hidden =
                    isOpen;

                accessibilityButton.setAttribute(
                    "aria-expanded",
                    String(!isOpen)
                );

            }
        );


        /*
            Controles de tamanho.
        */

        $("#increaseText")?.addEventListener(
            "click",
            increaseText
        );

        $("#decreaseText")?.addEventListener(
            "click",
            decreaseText
        );

        $("#resetAccessibility")?.addEventListener(
            "click",
            resetAccessibility
        );


        /*
            Alto contraste.
        */

        $("#highContrast")?.addEventListener(
            "click",
            toggleHighContrast
        );


        /*
            Leitura da página.
        */

        $("#readPage")?.addEventListener(
            "click",
            readPage
        );


        /*
            Para a leitura.
        */

        $("#stopReading")?.addEventListener(
            "click",
            stopReading
        );


        /*
            Inicializa as preferências salvas.
        */

        initAccessibility();

    }

);