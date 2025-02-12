'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">@rahat-os/source documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="contributing.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CONTRIBUTING
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-80476eb0421bb9cc8995b281832f166b1dc3e4068eab8c0896d922063b934d9fdd19757facffd5f9a154ea80acefc454bf3d2c2f258427cf463fcead5905c188"' : 'data-bs-target="#xs-controllers-links-module-AppModule-80476eb0421bb9cc8995b281832f166b1dc3e4068eab8c0896d922063b934d9fdd19757facffd5f9a154ea80acefc454bf3d2c2f258427cf463fcead5905c188"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-80476eb0421bb9cc8995b281832f166b1dc3e4068eab8c0896d922063b934d9fdd19757facffd5f9a154ea80acefc454bf3d2c2f258427cf463fcead5905c188"' :
                                            'id="xs-controllers-links-module-AppModule-80476eb0421bb9cc8995b281832f166b1dc3e4068eab8c0896d922063b934d9fdd19757facffd5f9a154ea80acefc454bf3d2c2f258427cf463fcead5905c188"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-80476eb0421bb9cc8995b281832f166b1dc3e4068eab8c0896d922063b934d9fdd19757facffd5f9a154ea80acefc454bf3d2c2f258427cf463fcead5905c188"' : 'data-bs-target="#xs-injectables-links-module-AppModule-80476eb0421bb9cc8995b281832f166b1dc3e4068eab8c0896d922063b934d9fdd19757facffd5f9a154ea80acefc454bf3d2c2f258427cf463fcead5905c188"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-80476eb0421bb9cc8995b281832f166b1dc3e4068eab8c0896d922063b934d9fdd19757facffd5f9a154ea80acefc454bf3d2c2f258427cf463fcead5905c188"' :
                                        'id="xs-injectables-links-module-AppModule-80476eb0421bb9cc8995b281832f166b1dc3e4068eab8c0896d922063b934d9fdd19757facffd5f9a154ea80acefc454bf3d2c2f258427cf463fcead5905c188"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-6015a6e176e9d6e7f473997293fb1ed5039b3fa6a9b8ce9860d68fb2faf0f156736a13ef3b9ca407e321e3076940026ff3fa306509161037971a990e2d548e1f-1"' : 'data-bs-target="#xs-controllers-links-module-AppModule-6015a6e176e9d6e7f473997293fb1ed5039b3fa6a9b8ce9860d68fb2faf0f156736a13ef3b9ca407e321e3076940026ff3fa306509161037971a990e2d548e1f-1"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-6015a6e176e9d6e7f473997293fb1ed5039b3fa6a9b8ce9860d68fb2faf0f156736a13ef3b9ca407e321e3076940026ff3fa306509161037971a990e2d548e1f-1"' :
                                            'id="xs-controllers-links-module-AppModule-6015a6e176e9d6e7f473997293fb1ed5039b3fa6a9b8ce9860d68fb2faf0f156736a13ef3b9ca407e321e3076940026ff3fa306509161037971a990e2d548e1f-1"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-6015a6e176e9d6e7f473997293fb1ed5039b3fa6a9b8ce9860d68fb2faf0f156736a13ef3b9ca407e321e3076940026ff3fa306509161037971a990e2d548e1f-1"' : 'data-bs-target="#xs-injectables-links-module-AppModule-6015a6e176e9d6e7f473997293fb1ed5039b3fa6a9b8ce9860d68fb2faf0f156736a13ef3b9ca407e321e3076940026ff3fa306509161037971a990e2d548e1f-1"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-6015a6e176e9d6e7f473997293fb1ed5039b3fa6a9b8ce9860d68fb2faf0f156736a13ef3b9ca407e321e3076940026ff3fa306509161037971a990e2d548e1f-1"' :
                                        'id="xs-injectables-links-module-AppModule-6015a6e176e9d6e7f473997293fb1ed5039b3fa6a9b8ce9860d68fb2faf0f156736a13ef3b9ca407e321e3076940026ff3fa306509161037971a990e2d548e1f-1"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppUsersModule.html" data-type="entity-link" >AppUsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppUsersModule-e7e4102de4860377e2fe9b45dd014336c861f7a0087234e0def61b6aaab09e857f771b829a84237b500b837b00c455aadf20c475617077e52b794577098431e9"' : 'data-bs-target="#xs-controllers-links-module-AppUsersModule-e7e4102de4860377e2fe9b45dd014336c861f7a0087234e0def61b6aaab09e857f771b829a84237b500b837b00c455aadf20c475617077e52b794577098431e9"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppUsersModule-e7e4102de4860377e2fe9b45dd014336c861f7a0087234e0def61b6aaab09e857f771b829a84237b500b837b00c455aadf20c475617077e52b794577098431e9"' :
                                            'id="xs-controllers-links-module-AppUsersModule-e7e4102de4860377e2fe9b45dd014336c861f7a0087234e0def61b6aaab09e857f771b829a84237b500b837b00c455aadf20c475617077e52b794577098431e9"' }>
                                            <li class="link">
                                                <a href="controllers/VendorsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VendorsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppUsersModule-e7e4102de4860377e2fe9b45dd014336c861f7a0087234e0def61b6aaab09e857f771b829a84237b500b837b00c455aadf20c475617077e52b794577098431e9"' : 'data-bs-target="#xs-injectables-links-module-AppUsersModule-e7e4102de4860377e2fe9b45dd014336c861f7a0087234e0def61b6aaab09e857f771b829a84237b500b837b00c455aadf20c475617077e52b794577098431e9"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppUsersModule-e7e4102de4860377e2fe9b45dd014336c861f7a0087234e0def61b6aaab09e857f771b829a84237b500b837b00c455aadf20c475617077e52b794577098431e9"' :
                                        'id="xs-injectables-links-module-AppUsersModule-e7e4102de4860377e2fe9b45dd014336c861f7a0087234e0def61b6aaab09e857f771b829a84237b500b837b00c455aadf20c475617077e52b794577098431e9"' }>
                                        <li class="link">
                                            <a href="injectables/VendorsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VendorsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/BeneficiaryModule.html" data-type="entity-link" >BeneficiaryModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-BeneficiaryModule-a9309135cea855127d93a68043b0a93a737242d17675d4c0006de14a54bc24f269fb4f18a0f3213c197adf820f8cd3ae2cce2ba0de3625753339d5eadaec0ef7"' : 'data-bs-target="#xs-controllers-links-module-BeneficiaryModule-a9309135cea855127d93a68043b0a93a737242d17675d4c0006de14a54bc24f269fb4f18a0f3213c197adf820f8cd3ae2cce2ba0de3625753339d5eadaec0ef7"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-BeneficiaryModule-a9309135cea855127d93a68043b0a93a737242d17675d4c0006de14a54bc24f269fb4f18a0f3213c197adf820f8cd3ae2cce2ba0de3625753339d5eadaec0ef7"' :
                                            'id="xs-controllers-links-module-BeneficiaryModule-a9309135cea855127d93a68043b0a93a737242d17675d4c0006de14a54bc24f269fb4f18a0f3213c197adf820f8cd3ae2cce2ba0de3625753339d5eadaec0ef7"' }>
                                            <li class="link">
                                                <a href="controllers/BeneficiaryController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BeneficiaryController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-BeneficiaryModule-a9309135cea855127d93a68043b0a93a737242d17675d4c0006de14a54bc24f269fb4f18a0f3213c197adf820f8cd3ae2cce2ba0de3625753339d5eadaec0ef7"' : 'data-bs-target="#xs-injectables-links-module-BeneficiaryModule-a9309135cea855127d93a68043b0a93a737242d17675d4c0006de14a54bc24f269fb4f18a0f3213c197adf820f8cd3ae2cce2ba0de3625753339d5eadaec0ef7"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-BeneficiaryModule-a9309135cea855127d93a68043b0a93a737242d17675d4c0006de14a54bc24f269fb4f18a0f3213c197adf820f8cd3ae2cce2ba0de3625753339d5eadaec0ef7"' :
                                        'id="xs-injectables-links-module-BeneficiaryModule-a9309135cea855127d93a68043b0a93a737242d17675d4c0006de14a54bc24f269fb4f18a0f3213c197adf820f8cd3ae2cce2ba0de3625753339d5eadaec0ef7"' }>
                                        <li class="link">
                                            <a href="injectables/BeneficiaryService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BeneficiaryService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/BeneficiaryStatService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BeneficiaryStatService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/VerificationService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VerificationService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/BeneficiaryModule.html" data-type="entity-link" >BeneficiaryModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-BeneficiaryModule-dd4ed157253b8f572b085c0a643ff6d2178e313f831978aa5920f0ea1020597ec45f55d177b9066b68e8875ea103eeb78a80e6fd4994f8afc52dbb459bcfc686-1"' : 'data-bs-target="#xs-controllers-links-module-BeneficiaryModule-dd4ed157253b8f572b085c0a643ff6d2178e313f831978aa5920f0ea1020597ec45f55d177b9066b68e8875ea103eeb78a80e6fd4994f8afc52dbb459bcfc686-1"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-BeneficiaryModule-dd4ed157253b8f572b085c0a643ff6d2178e313f831978aa5920f0ea1020597ec45f55d177b9066b68e8875ea103eeb78a80e6fd4994f8afc52dbb459bcfc686-1"' :
                                            'id="xs-controllers-links-module-BeneficiaryModule-dd4ed157253b8f572b085c0a643ff6d2178e313f831978aa5920f0ea1020597ec45f55d177b9066b68e8875ea103eeb78a80e6fd4994f8afc52dbb459bcfc686-1"' }>
                                            <li class="link">
                                                <a href="controllers/BeneficiaryController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BeneficiaryController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/GrievanceModule.html" data-type="entity-link" >GrievanceModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-GrievanceModule-14fa8e2da84a358489fb4893ca3c88c4614d49c4dfadf2dee084732895ae6c812fee75f1ab66dda806ef142982473f0f0202682e7301883145b945daf304ef6f"' : 'data-bs-target="#xs-controllers-links-module-GrievanceModule-14fa8e2da84a358489fb4893ca3c88c4614d49c4dfadf2dee084732895ae6c812fee75f1ab66dda806ef142982473f0f0202682e7301883145b945daf304ef6f"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-GrievanceModule-14fa8e2da84a358489fb4893ca3c88c4614d49c4dfadf2dee084732895ae6c812fee75f1ab66dda806ef142982473f0f0202682e7301883145b945daf304ef6f"' :
                                            'id="xs-controllers-links-module-GrievanceModule-14fa8e2da84a358489fb4893ca3c88c4614d49c4dfadf2dee084732895ae6c812fee75f1ab66dda806ef142982473f0f0202682e7301883145b945daf304ef6f"' }>
                                            <li class="link">
                                                <a href="controllers/GrievanceController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GrievanceController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-GrievanceModule-14fa8e2da84a358489fb4893ca3c88c4614d49c4dfadf2dee084732895ae6c812fee75f1ab66dda806ef142982473f0f0202682e7301883145b945daf304ef6f"' : 'data-bs-target="#xs-injectables-links-module-GrievanceModule-14fa8e2da84a358489fb4893ca3c88c4614d49c4dfadf2dee084732895ae6c812fee75f1ab66dda806ef142982473f0f0202682e7301883145b945daf304ef6f"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-GrievanceModule-14fa8e2da84a358489fb4893ca3c88c4614d49c4dfadf2dee084732895ae6c812fee75f1ab66dda806ef142982473f0f0202682e7301883145b945daf304ef6f"' :
                                        'id="xs-injectables-links-module-GrievanceModule-14fa8e2da84a358489fb4893ca3c88c4614d49c4dfadf2dee084732895ae6c812fee75f1ab66dda806ef142982473f0f0202682e7301883145b945daf304ef6f"' }>
                                        <li class="link">
                                            <a href="injectables/GrievanceService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GrievanceService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ListenersModule.html" data-type="entity-link" >ListenersModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ListenersModule-f7cc7b31fbd2fd54c06dc5c9277173451c20aea28af710de6133bbd2b919c63cb885683dedad979b0e639c824044342cdecc14b85004db0c3090c355df2f8f68"' : 'data-bs-target="#xs-injectables-links-module-ListenersModule-f7cc7b31fbd2fd54c06dc5c9277173451c20aea28af710de6133bbd2b919c63cb885683dedad979b0e639c824044342cdecc14b85004db0c3090c355df2f8f68"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ListenersModule-f7cc7b31fbd2fd54c06dc5c9277173451c20aea28af710de6133bbd2b919c63cb885683dedad979b0e639c824044342cdecc14b85004db0c3090c355df2f8f68"' :
                                        'id="xs-injectables-links-module-ListenersModule-f7cc7b31fbd2fd54c06dc5c9277173451c20aea28af710de6133bbd2b919c63cb885683dedad979b0e639c824044342cdecc14b85004db0c3090c355df2f8f68"' }>
                                        <li class="link">
                                            <a href="injectables/BeneficiaryStatService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BeneficiaryStatService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/EmailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmailService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ListenersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListenersService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/StatsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StatsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ListenersModule.html" data-type="entity-link" >ListenersModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ListenersModule-8b0bfc092c6b5648fef35f0a22095d01bd7ba333dabcc7873862cc52d83125ef13e09f6a4ca34c2ccf47e87e55c61fcc59ab7230d0b98ac99bdb4eaaaabef061-1"' : 'data-bs-target="#xs-injectables-links-module-ListenersModule-8b0bfc092c6b5648fef35f0a22095d01bd7ba333dabcc7873862cc52d83125ef13e09f6a4ca34c2ccf47e87e55c61fcc59ab7230d0b98ac99bdb4eaaaabef061-1"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ListenersModule-8b0bfc092c6b5648fef35f0a22095d01bd7ba333dabcc7873862cc52d83125ef13e09f6a4ca34c2ccf47e87e55c61fcc59ab7230d0b98ac99bdb4eaaaabef061-1"' :
                                        'id="xs-injectables-links-module-ListenersModule-8b0bfc092c6b5648fef35f0a22095d01bd7ba333dabcc7873862cc52d83125ef13e09f6a4ca34c2ccf47e87e55c61fcc59ab7230d0b98ac99bdb4eaaaabef061-1"' }>
                                        <li class="link">
                                            <a href="injectables/DevService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DevService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/EmailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmailService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ListenersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListenersService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MessageSenderService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MessageSenderService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MetaTxnService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MetaTxnService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/MetaTxnProcessorsModule.html" data-type="entity-link" >MetaTxnProcessorsModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ProcessorsModule.html" data-type="entity-link" >ProcessorsModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ProcessorsModule.html" data-type="entity-link" >ProcessorsModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ProjectModule.html" data-type="entity-link" >ProjectModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ProjectModule-591d589bb9304d33a938975e8a47b20421ee81067a20de5a1cfd061794a591ff9df2055778778c394339dfe578193e73ba8085649129a7b7b8ef08c41f292dcd"' : 'data-bs-target="#xs-controllers-links-module-ProjectModule-591d589bb9304d33a938975e8a47b20421ee81067a20de5a1cfd061794a591ff9df2055778778c394339dfe578193e73ba8085649129a7b7b8ef08c41f292dcd"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ProjectModule-591d589bb9304d33a938975e8a47b20421ee81067a20de5a1cfd061794a591ff9df2055778778c394339dfe578193e73ba8085649129a7b7b8ef08c41f292dcd"' :
                                            'id="xs-controllers-links-module-ProjectModule-591d589bb9304d33a938975e8a47b20421ee81067a20de5a1cfd061794a591ff9df2055778778c394339dfe578193e73ba8085649129a7b7b8ef08c41f292dcd"' }>
                                            <li class="link">
                                                <a href="controllers/ProjectController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProjectController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ProjectModule-591d589bb9304d33a938975e8a47b20421ee81067a20de5a1cfd061794a591ff9df2055778778c394339dfe578193e73ba8085649129a7b7b8ef08c41f292dcd"' : 'data-bs-target="#xs-injectables-links-module-ProjectModule-591d589bb9304d33a938975e8a47b20421ee81067a20de5a1cfd061794a591ff9df2055778778c394339dfe578193e73ba8085649129a7b7b8ef08c41f292dcd"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ProjectModule-591d589bb9304d33a938975e8a47b20421ee81067a20de5a1cfd061794a591ff9df2055778778c394339dfe578193e73ba8085649129a7b7b8ef08c41f292dcd"' :
                                        'id="xs-injectables-links-module-ProjectModule-591d589bb9304d33a938975e8a47b20421ee81067a20de5a1cfd061794a591ff9df2055778778c394339dfe578193e73ba8085649129a7b7b8ef08c41f292dcd"' }>
                                        <li class="link">
                                            <a href="injectables/ProjectService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProjectService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/QueueModule.html" data-type="entity-link" >QueueModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-QueueModule-85d7e00f91a6a85f8155d02e76daaf1609da91ceb17047d4d288f00ae32c00d69f9dd7563c8f245afe88b152f36b04096eaf5206c0efc1d2a0dfc5abe516a302"' : 'data-bs-target="#xs-controllers-links-module-QueueModule-85d7e00f91a6a85f8155d02e76daaf1609da91ceb17047d4d288f00ae32c00d69f9dd7563c8f245afe88b152f36b04096eaf5206c0efc1d2a0dfc5abe516a302"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-QueueModule-85d7e00f91a6a85f8155d02e76daaf1609da91ceb17047d4d288f00ae32c00d69f9dd7563c8f245afe88b152f36b04096eaf5206c0efc1d2a0dfc5abe516a302"' :
                                            'id="xs-controllers-links-module-QueueModule-85d7e00f91a6a85f8155d02e76daaf1609da91ceb17047d4d288f00ae32c00d69f9dd7563c8f245afe88b152f36b04096eaf5206c0efc1d2a0dfc5abe516a302"' }>
                                            <li class="link">
                                                <a href="controllers/QueueController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QueueController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-QueueModule-85d7e00f91a6a85f8155d02e76daaf1609da91ceb17047d4d288f00ae32c00d69f9dd7563c8f245afe88b152f36b04096eaf5206c0efc1d2a0dfc5abe516a302"' : 'data-bs-target="#xs-injectables-links-module-QueueModule-85d7e00f91a6a85f8155d02e76daaf1609da91ceb17047d4d288f00ae32c00d69f9dd7563c8f245afe88b152f36b04096eaf5206c0efc1d2a0dfc5abe516a302"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-QueueModule-85d7e00f91a6a85f8155d02e76daaf1609da91ceb17047d4d288f00ae32c00d69f9dd7563c8f245afe88b152f36b04096eaf5206c0efc1d2a0dfc5abe516a302"' :
                                        'id="xs-injectables-links-module-QueueModule-85d7e00f91a6a85f8155d02e76daaf1609da91ceb17047d4d288f00ae32c00d69f9dd7563c8f245afe88b152f36b04096eaf5206c0efc1d2a0dfc5abe516a302"' }>
                                        <li class="link">
                                            <a href="injectables/QueueService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QueueService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RequestContextModule.html" data-type="entity-link" >RequestContextModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-RequestContextModule-318525568bf2647b374ddfa00176bf30a4d395811d4c3d419f3c6fb61367582e3e911d0562321871faf8df98ad1be9acd838b4e42a770838185af0fe277bb5d6"' : 'data-bs-target="#xs-injectables-links-module-RequestContextModule-318525568bf2647b374ddfa00176bf30a4d395811d4c3d419f3c6fb61367582e3e911d0562321871faf8df98ad1be9acd838b4e42a770838185af0fe277bb5d6"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RequestContextModule-318525568bf2647b374ddfa00176bf30a4d395811d4c3d419f3c6fb61367582e3e911d0562321871faf8df98ad1be9acd838b4e42a770838185af0fe277bb5d6"' :
                                        'id="xs-injectables-links-module-RequestContextModule-318525568bf2647b374ddfa00176bf30a4d395811d4c3d419f3c6fb61367582e3e911d0562321871faf8df98ad1be9acd838b4e42a770838185af0fe277bb5d6"' }>
                                        <li class="link">
                                            <a href="injectables/RequestContextService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RequestContextService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StatsModule.html" data-type="entity-link" >StatsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-StatsModule-624869f3bf84748058c51f2faff785ae64c43ac978b5c3419c714260403b9d0293e443aac278693a617c0537e28c92d0839cf127c5e82ed14c31d7a4ad082368"' : 'data-bs-target="#xs-controllers-links-module-StatsModule-624869f3bf84748058c51f2faff785ae64c43ac978b5c3419c714260403b9d0293e443aac278693a617c0537e28c92d0839cf127c5e82ed14c31d7a4ad082368"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-StatsModule-624869f3bf84748058c51f2faff785ae64c43ac978b5c3419c714260403b9d0293e443aac278693a617c0537e28c92d0839cf127c5e82ed14c31d7a4ad082368"' :
                                            'id="xs-controllers-links-module-StatsModule-624869f3bf84748058c51f2faff785ae64c43ac978b5c3419c714260403b9d0293e443aac278693a617c0537e28c92d0839cf127c5e82ed14c31d7a4ad082368"' }>
                                            <li class="link">
                                                <a href="controllers/StatsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StatsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-StatsModule-624869f3bf84748058c51f2faff785ae64c43ac978b5c3419c714260403b9d0293e443aac278693a617c0537e28c92d0839cf127c5e82ed14c31d7a4ad082368"' : 'data-bs-target="#xs-injectables-links-module-StatsModule-624869f3bf84748058c51f2faff785ae64c43ac978b5c3419c714260403b9d0293e443aac278693a617c0537e28c92d0839cf127c5e82ed14c31d7a4ad082368"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StatsModule-624869f3bf84748058c51f2faff785ae64c43ac978b5c3419c714260403b9d0293e443aac278693a617c0537e28c92d0839cf127c5e82ed14c31d7a4ad082368"' :
                                        'id="xs-injectables-links-module-StatsModule-624869f3bf84748058c51f2faff785ae64c43ac978b5c3419c714260403b9d0293e443aac278693a617c0537e28c92d0839cf127c5e82ed14c31d7a4ad082368"' }>
                                        <li class="link">
                                            <a href="injectables/StatsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StatsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TokenModule.html" data-type="entity-link" >TokenModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-TokenModule-5ab2b11c342e54a11cdde2bcfc9ff543a623e2ec9f8b2b7cdcb3acb03a825c3fad3fa8083af7337f69a40e00544169df3b909cf11a0a1b4ee80b3652294c4898"' : 'data-bs-target="#xs-controllers-links-module-TokenModule-5ab2b11c342e54a11cdde2bcfc9ff543a623e2ec9f8b2b7cdcb3acb03a825c3fad3fa8083af7337f69a40e00544169df3b909cf11a0a1b4ee80b3652294c4898"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-TokenModule-5ab2b11c342e54a11cdde2bcfc9ff543a623e2ec9f8b2b7cdcb3acb03a825c3fad3fa8083af7337f69a40e00544169df3b909cf11a0a1b4ee80b3652294c4898"' :
                                            'id="xs-controllers-links-module-TokenModule-5ab2b11c342e54a11cdde2bcfc9ff543a623e2ec9f8b2b7cdcb3acb03a825c3fad3fa8083af7337f69a40e00544169df3b909cf11a0a1b4ee80b3652294c4898"' }>
                                            <li class="link">
                                                <a href="controllers/TokenController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TokenController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-TokenModule-5ab2b11c342e54a11cdde2bcfc9ff543a623e2ec9f8b2b7cdcb3acb03a825c3fad3fa8083af7337f69a40e00544169df3b909cf11a0a1b4ee80b3652294c4898"' : 'data-bs-target="#xs-injectables-links-module-TokenModule-5ab2b11c342e54a11cdde2bcfc9ff543a623e2ec9f8b2b7cdcb3acb03a825c3fad3fa8083af7337f69a40e00544169df3b909cf11a0a1b4ee80b3652294c4898"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TokenModule-5ab2b11c342e54a11cdde2bcfc9ff543a623e2ec9f8b2b7cdcb3acb03a825c3fad3fa8083af7337f69a40e00544169df3b909cf11a0a1b4ee80b3652294c4898"' :
                                        'id="xs-injectables-links-module-TokenModule-5ab2b11c342e54a11cdde2bcfc9ff543a623e2ec9f8b2b7cdcb3acb03a825c3fad3fa8083af7337f69a40e00544169df3b909cf11a0a1b4ee80b3652294c4898"' }>
                                        <li class="link">
                                            <a href="injectables/TokenService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TokenService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UploadModule.html" data-type="entity-link" >UploadModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UploadModule-f453eea33197e4d886b1c367f6eeba247ba6d730849ae8efa14f41565be1323e24831f2e583804fc850c1d8234e5f492884b258f08edc06adb44e3e98b5effc4"' : 'data-bs-target="#xs-controllers-links-module-UploadModule-f453eea33197e4d886b1c367f6eeba247ba6d730849ae8efa14f41565be1323e24831f2e583804fc850c1d8234e5f492884b258f08edc06adb44e3e98b5effc4"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UploadModule-f453eea33197e4d886b1c367f6eeba247ba6d730849ae8efa14f41565be1323e24831f2e583804fc850c1d8234e5f492884b258f08edc06adb44e3e98b5effc4"' :
                                            'id="xs-controllers-links-module-UploadModule-f453eea33197e4d886b1c367f6eeba247ba6d730849ae8efa14f41565be1323e24831f2e583804fc850c1d8234e5f492884b258f08edc06adb44e3e98b5effc4"' }>
                                            <li class="link">
                                                <a href="controllers/UploadController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UploadController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UploadModule-f453eea33197e4d886b1c367f6eeba247ba6d730849ae8efa14f41565be1323e24831f2e583804fc850c1d8234e5f492884b258f08edc06adb44e3e98b5effc4"' : 'data-bs-target="#xs-injectables-links-module-UploadModule-f453eea33197e4d886b1c367f6eeba247ba6d730849ae8efa14f41565be1323e24831f2e583804fc850c1d8234e5f492884b258f08edc06adb44e3e98b5effc4"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UploadModule-f453eea33197e4d886b1c367f6eeba247ba6d730849ae8efa14f41565be1323e24831f2e583804fc850c1d8234e5f492884b258f08edc06adb44e3e98b5effc4"' :
                                        'id="xs-injectables-links-module-UploadModule-f453eea33197e4d886b1c367f6eeba247ba6d730849ae8efa14f41565be1323e24831f2e583804fc850c1d8234e5f492884b258f08edc06adb44e3e98b5effc4"' }>
                                        <li class="link">
                                            <a href="injectables/UploadService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UploadService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/VendorsModule.html" data-type="entity-link" >VendorsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-VendorsModule-b15fc0c599de43c6cc6c4a8ce19cb8344ebca43ce7a8629f67585097588291b8f67595b08509bee5be1d12d1ce6d8f6ec4a8b8e4560db5eb00c2873d47b0cbf3"' : 'data-bs-target="#xs-controllers-links-module-VendorsModule-b15fc0c599de43c6cc6c4a8ce19cb8344ebca43ce7a8629f67585097588291b8f67595b08509bee5be1d12d1ce6d8f6ec4a8b8e4560db5eb00c2873d47b0cbf3"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-VendorsModule-b15fc0c599de43c6cc6c4a8ce19cb8344ebca43ce7a8629f67585097588291b8f67595b08509bee5be1d12d1ce6d8f6ec4a8b8e4560db5eb00c2873d47b0cbf3"' :
                                            'id="xs-controllers-links-module-VendorsModule-b15fc0c599de43c6cc6c4a8ce19cb8344ebca43ce7a8629f67585097588291b8f67595b08509bee5be1d12d1ce6d8f6ec4a8b8e4560db5eb00c2873d47b0cbf3"' }>
                                            <li class="link">
                                                <a href="controllers/VendorsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VendorsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-VendorsModule-b15fc0c599de43c6cc6c4a8ce19cb8344ebca43ce7a8629f67585097588291b8f67595b08509bee5be1d12d1ce6d8f6ec4a8b8e4560db5eb00c2873d47b0cbf3"' : 'data-bs-target="#xs-injectables-links-module-VendorsModule-b15fc0c599de43c6cc6c4a8ce19cb8344ebca43ce7a8629f67585097588291b8f67595b08509bee5be1d12d1ce6d8f6ec4a8b8e4560db5eb00c2873d47b0cbf3"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-VendorsModule-b15fc0c599de43c6cc6c4a8ce19cb8344ebca43ce7a8629f67585097588291b8f67595b08509bee5be1d12d1ce6d8f6ec4a8b8e4560db5eb00c2873d47b0cbf3"' :
                                        'id="xs-injectables-links-module-VendorsModule-b15fc0c599de43c6cc6c4a8ce19cb8344ebca43ce7a8629f67585097588291b8f67595b08509bee5be1d12d1ce6d8f6ec4a8b8e4560db5eb00c2873d47b0cbf3"' }>
                                        <li class="link">
                                            <a href="injectables/VendorsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VendorsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AddBenfGroupToProjectDto.html" data-type="entity-link" >AddBenfGroupToProjectDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddBenToProjectDto.html" data-type="entity-link" >AddBenToProjectDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddOwnerCall.html" data-type="entity-link" >AddOwnerCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddOwnerCall__Inputs.html" data-type="entity-link" >AddOwnerCall__Inputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddOwnerCall__Outputs.html" data-type="entity-link" >AddOwnerCall__Outputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddToProjectDto.html" data-type="entity-link" >AddToProjectDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Approval.html" data-type="entity-link" >Approval</a>
                            </li>
                            <li class="link">
                                <a href="classes/Approval-1.html" data-type="entity-link" >Approval</a>
                            </li>
                            <li class="link">
                                <a href="classes/Approval__Params.html" data-type="entity-link" >Approval__Params</a>
                            </li>
                            <li class="link">
                                <a href="classes/ApproveCall.html" data-type="entity-link" >ApproveCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/ApproveCall__Inputs.html" data-type="entity-link" >ApproveCall__Inputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/ApproveCall__Outputs.html" data-type="entity-link" >ApproveCall__Outputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/ApproveTokenCall.html" data-type="entity-link" >ApproveTokenCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/ApproveTokenCall__Inputs.html" data-type="entity-link" >ApproveTokenCall__Inputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/ApproveTokenCall__Outputs.html" data-type="entity-link" >ApproveTokenCall__Outputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthorityUpdated.html" data-type="entity-link" >AuthorityUpdated</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthorityUpdated-1.html" data-type="entity-link" >AuthorityUpdated</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthorityUpdated-2.html" data-type="entity-link" >AuthorityUpdated</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthorityUpdated__Params.html" data-type="entity-link" >AuthorityUpdated__Params</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthorityUpdated__Params-1.html" data-type="entity-link" >AuthorityUpdated__Params</a>
                            </li>
                            <li class="link">
                                <a href="classes/Beneficiary.html" data-type="entity-link" >Beneficiary</a>
                            </li>
                            <li class="link">
                                <a href="classes/Beneficiary-1.html" data-type="entity-link" >Beneficiary</a>
                            </li>
                            <li class="link">
                                <a href="classes/Beneficiary-2.html" data-type="entity-link" >Beneficiary</a>
                            </li>
                            <li class="link">
                                <a href="classes/BeneficiaryConsumer.html" data-type="entity-link" >BeneficiaryConsumer</a>
                            </li>
                            <li class="link">
                                <a href="classes/BeneficiaryProcessor.html" data-type="entity-link" >BeneficiaryProcessor</a>
                            </li>
                            <li class="link">
                                <a href="classes/BurnCall.html" data-type="entity-link" >BurnCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/BurnCall__Inputs.html" data-type="entity-link" >BurnCall__Inputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/BurnCall__Outputs.html" data-type="entity-link" >BurnCall__Outputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/BurnFromCall.html" data-type="entity-link" >BurnFromCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/BurnFromCall__Inputs.html" data-type="entity-link" >BurnFromCall__Inputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/BurnFromCall__Outputs.html" data-type="entity-link" >BurnFromCall__Outputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/CancelCall.html" data-type="entity-link" >CancelCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/CancelCall__Inputs.html" data-type="entity-link" >CancelCall__Inputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/CancelCall__Outputs.html" data-type="entity-link" >CancelCall__Outputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChangeGrievanceStatusDTO.html" data-type="entity-link" >ChangeGrievanceStatusDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ClaimTokenCall.html" data-type="entity-link" >ClaimTokenCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/ClaimTokenCall__Inputs.html" data-type="entity-link" >ClaimTokenCall__Inputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/ClaimTokenCall__Outputs.html" data-type="entity-link" >ClaimTokenCall__Outputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConstructorCall.html" data-type="entity-link" >ConstructorCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConstructorCall-1.html" data-type="entity-link" >ConstructorCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConstructorCall-2.html" data-type="entity-link" >ConstructorCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConstructorCall__Inputs.html" data-type="entity-link" >ConstructorCall__Inputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConstructorCall__Inputs-1.html" data-type="entity-link" >ConstructorCall__Inputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConstructorCall__Inputs-2.html" data-type="entity-link" >ConstructorCall__Inputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConstructorCall__Outputs.html" data-type="entity-link" >ConstructorCall__Outputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConstructorCall__Outputs-1.html" data-type="entity-link" >ConstructorCall__Outputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConstructorCall__Outputs-2.html" data-type="entity-link" >ConstructorCall__Outputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConsumeScheduledOpCall.html" data-type="entity-link" >ConsumeScheduledOpCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConsumeScheduledOpCall__Inputs.html" data-type="entity-link" >ConsumeScheduledOpCall__Inputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConsumeScheduledOpCall__Outputs.html" data-type="entity-link" >ConsumeScheduledOpCall__Outputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateAuthAppDto.html" data-type="entity-link" >CreateAuthAppDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateBeneficiaryDto.html" data-type="entity-link" >CreateBeneficiaryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateBeneficiaryGroupsDto.html" data-type="entity-link" >CreateBeneficiaryGroupsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateGrievanceDTO.html" data-type="entity-link" >CreateGrievanceDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProjectDto.html" data-type="entity-link" >CreateProjectDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTokenCall.html" data-type="entity-link" >CreateTokenCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTokenCall__Inputs.html" data-type="entity-link" >CreateTokenCall__Inputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTokenCall__Outputs.html" data-type="entity-link" >CreateTokenCall__Outputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTokenDto.html" data-type="entity-link" >CreateTokenDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExceptionFilter.html" data-type="entity-link" >ExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExceptionHandler.html" data-type="entity-link" >ExceptionHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExecuteCall.html" data-type="entity-link" >ExecuteCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExecuteCall__Inputs.html" data-type="entity-link" >ExecuteCall__Inputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExecuteCall__Outputs.html" data-type="entity-link" >ExecuteCall__Outputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileUploadDto.html" data-type="entity-link" >FileUploadDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetVendorOtp.html" data-type="entity-link" >GetVendorOtp</a>
                            </li>
                            <li class="link">
                                <a href="classes/GlobalCustomExceptionFilter.html" data-type="entity-link" >GlobalCustomExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/GrantRoleCall.html" data-type="entity-link" >GrantRoleCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/GrantRoleCall__Inputs.html" data-type="entity-link" >GrantRoleCall__Inputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/GrantRoleCall__Outputs.html" data-type="entity-link" >GrantRoleCall__Outputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/GraphQuery.html" data-type="entity-link" >GraphQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/ImportTempBenefDto.html" data-type="entity-link" >ImportTempBenefDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LabelRoleCall.html" data-type="entity-link" >LabelRoleCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/LabelRoleCall__Inputs.html" data-type="entity-link" >LabelRoleCall__Inputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/LabelRoleCall__Outputs.html" data-type="entity-link" >LabelRoleCall__Outputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListAuthAppsDto.html" data-type="entity-link" >ListAuthAppsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListBeneficiaryDto.html" data-type="entity-link" >ListBeneficiaryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListBeneficiaryGroupDto.html" data-type="entity-link" >ListBeneficiaryGroupDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListGrievanceDTO.html" data-type="entity-link" >ListGrievanceDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListProjectBeneficiaryDto.html" data-type="entity-link" >ListProjectBeneficiaryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListTempBeneficiariesDto.html" data-type="entity-link" >ListTempBeneficiariesDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListTempGroupsDto.html" data-type="entity-link" >ListTempGroupsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/MetaTransationProcessor.html" data-type="entity-link" >MetaTransationProcessor</a>
                            </li>
                            <li class="link">
                                <a href="classes/MintCall.html" data-type="entity-link" >MintCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/MintCall__Inputs.html" data-type="entity-link" >MintCall__Inputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/MintCall__Outputs.html" data-type="entity-link" >MintCall__Outputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/MintTokenAndApproveCall.html" data-type="entity-link" >MintTokenAndApproveCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/MintTokenAndApproveCall__Inputs.html" data-type="entity-link" >MintTokenAndApproveCall__Inputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/MintTokenAndApproveCall__Outputs.html" data-type="entity-link" >MintTokenAndApproveCall__Outputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/MintTokenAndSendCall.html" data-type="entity-link" >MintTokenAndSendCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/MintTokenAndSendCall__Inputs.html" data-type="entity-link" >MintTokenAndSendCall__Inputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/MintTokenAndSendCall__Outputs.html" data-type="entity-link" >MintTokenAndSendCall__Outputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/MintTokenCall.html" data-type="entity-link" >MintTokenCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/MintTokenCall__Inputs.html" data-type="entity-link" >MintTokenCall__Inputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/MintTokenCall__Outputs.html" data-type="entity-link" >MintTokenCall__Outputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/MulticallCall.html" data-type="entity-link" >MulticallCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/MulticallCall-1.html" data-type="entity-link" >MulticallCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/MulticallCall__Inputs.html" data-type="entity-link" >MulticallCall__Inputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/MulticallCall__Inputs-1.html" data-type="entity-link" >MulticallCall__Inputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/MulticallCall__Outputs.html" data-type="entity-link" >MulticallCall__Outputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/MulticallCall__Outputs-1.html" data-type="entity-link" >MulticallCall__Outputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/OperationCanceled.html" data-type="entity-link" >OperationCanceled</a>
                            </li>
                            <li class="link">
                                <a href="classes/OperationCanceled-1.html" data-type="entity-link" >OperationCanceled</a>
                            </li>
                            <li class="link">
                                <a href="classes/OperationCanceled__Params.html" data-type="entity-link" >OperationCanceled__Params</a>
                            </li>
                            <li class="link">
                                <a href="classes/OperationExecuted.html" data-type="entity-link" >OperationExecuted</a>
                            </li>
                            <li class="link">
                                <a href="classes/OperationExecuted-1.html" data-type="entity-link" >OperationExecuted</a>
                            </li>
                            <li class="link">
                                <a href="classes/OperationExecuted__Params.html" data-type="entity-link" >OperationExecuted__Params</a>
                            </li>
                            <li class="link">
                                <a href="classes/OperationScheduled.html" data-type="entity-link" >OperationScheduled</a>
                            </li>
                            <li class="link">
                                <a href="classes/OperationScheduled-1.html" data-type="entity-link" >OperationScheduled</a>
                            </li>
                            <li class="link">
                                <a href="classes/OperationScheduled__Params.html" data-type="entity-link" >OperationScheduled__Params</a>
                            </li>
                            <li class="link">
                                <a href="classes/OwnerAdded.html" data-type="entity-link" >OwnerAdded</a>
                            </li>
                            <li class="link">
                                <a href="classes/OwnerAdded-1.html" data-type="entity-link" >OwnerAdded</a>
                            </li>
                            <li class="link">
                                <a href="classes/OwnerAdded__Params.html" data-type="entity-link" >OwnerAdded__Params</a>
                            </li>
                            <li class="link">
                                <a href="classes/OwnerRemoved.html" data-type="entity-link" >OwnerRemoved</a>
                            </li>
                            <li class="link">
                                <a href="classes/OwnerRemoved-1.html" data-type="entity-link" >OwnerRemoved</a>
                            </li>
                            <li class="link">
                                <a href="classes/OwnerRemoved__Params.html" data-type="entity-link" >OwnerRemoved__Params</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProjectCommunicationDto.html" data-type="entity-link" >ProjectCommunicationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProjectProcessor.html" data-type="entity-link" >ProjectProcessor</a>
                            </li>
                            <li class="link">
                                <a href="classes/RahatAccessManager.html" data-type="entity-link" >RahatAccessManager</a>
                            </li>
                            <li class="link">
                                <a href="classes/RahatAccessManager__canCallResult.html" data-type="entity-link" >RahatAccessManager__canCallResult</a>
                            </li>
                            <li class="link">
                                <a href="classes/RahatAccessManager__getAccessResult.html" data-type="entity-link" >RahatAccessManager__getAccessResult</a>
                            </li>
                            <li class="link">
                                <a href="classes/RahatAccessManager__hasRoleResult.html" data-type="entity-link" >RahatAccessManager__hasRoleResult</a>
                            </li>
                            <li class="link">
                                <a href="classes/RahatAccessManager__scheduleResult.html" data-type="entity-link" >RahatAccessManager__scheduleResult</a>
                            </li>
                            <li class="link">
                                <a href="classes/RahatProcessor.html" data-type="entity-link" >RahatProcessor</a>
                            </li>
                            <li class="link">
                                <a href="classes/RahatToken.html" data-type="entity-link" >RahatToken</a>
                            </li>
                            <li class="link">
                                <a href="classes/RahatToken-1.html" data-type="entity-link" >RahatToken</a>
                            </li>
                            <li class="link">
                                <a href="classes/RahatTokenAuthorityUpdated.html" data-type="entity-link" >RahatTokenAuthorityUpdated</a>
                            </li>
                            <li class="link">
                                <a href="classes/RahatTreasury.html" data-type="entity-link" >RahatTreasury</a>
                            </li>
                            <li class="link">
                                <a href="classes/RahatTreasury__getAllowanceAndBalanceResult.html" data-type="entity-link" >RahatTreasury__getAllowanceAndBalanceResult</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveOwnerCall.html" data-type="entity-link" >RemoveOwnerCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveOwnerCall__Inputs.html" data-type="entity-link" >RemoveOwnerCall__Inputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveOwnerCall__Outputs.html" data-type="entity-link" >RemoveOwnerCall__Outputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/RenounceRoleCall.html" data-type="entity-link" >RenounceRoleCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/RenounceRoleCall__Inputs.html" data-type="entity-link" >RenounceRoleCall__Inputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/RenounceRoleCall__Outputs.html" data-type="entity-link" >RenounceRoleCall__Outputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/RevokeRoleCall.html" data-type="entity-link" >RevokeRoleCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/RevokeRoleCall__Inputs.html" data-type="entity-link" >RevokeRoleCall__Inputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/RevokeRoleCall__Outputs.html" data-type="entity-link" >RevokeRoleCall__Outputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoleAdminChanged.html" data-type="entity-link" >RoleAdminChanged</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoleAdminChanged-1.html" data-type="entity-link" >RoleAdminChanged</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoleAdminChanged__Params.html" data-type="entity-link" >RoleAdminChanged__Params</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoleGrantDelayChanged.html" data-type="entity-link" >RoleGrantDelayChanged</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoleGrantDelayChanged-1.html" data-type="entity-link" >RoleGrantDelayChanged</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoleGrantDelayChanged__Params.html" data-type="entity-link" >RoleGrantDelayChanged__Params</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoleGranted.html" data-type="entity-link" >RoleGranted</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoleGranted-1.html" data-type="entity-link" >RoleGranted</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoleGranted__Params.html" data-type="entity-link" >RoleGranted__Params</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoleGuardianChanged.html" data-type="entity-link" >RoleGuardianChanged</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoleGuardianChanged-1.html" data-type="entity-link" >RoleGuardianChanged</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoleGuardianChanged__Params.html" data-type="entity-link" >RoleGuardianChanged__Params</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoleLabel.html" data-type="entity-link" >RoleLabel</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoleLabel-1.html" data-type="entity-link" >RoleLabel</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoleLabel__Params.html" data-type="entity-link" >RoleLabel__Params</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoleRevoked.html" data-type="entity-link" >RoleRevoked</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoleRevoked-1.html" data-type="entity-link" >RoleRevoked</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoleRevoked__Params.html" data-type="entity-link" >RoleRevoked__Params</a>
                            </li>
                            <li class="link">
                                <a href="classes/ScheduleCall.html" data-type="entity-link" >ScheduleCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/ScheduleCall__Inputs.html" data-type="entity-link" >ScheduleCall__Inputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/ScheduleCall__Outputs.html" data-type="entity-link" >ScheduleCall__Outputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetAuthorityCall.html" data-type="entity-link" >SetAuthorityCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetAuthorityCall-1.html" data-type="entity-link" >SetAuthorityCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetAuthorityCall__Inputs.html" data-type="entity-link" >SetAuthorityCall__Inputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetAuthorityCall__Inputs-1.html" data-type="entity-link" >SetAuthorityCall__Inputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetAuthorityCall__Outputs.html" data-type="entity-link" >SetAuthorityCall__Outputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetAuthorityCall__Outputs-1.html" data-type="entity-link" >SetAuthorityCall__Outputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetGrantDelayCall.html" data-type="entity-link" >SetGrantDelayCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetGrantDelayCall__Inputs.html" data-type="entity-link" >SetGrantDelayCall__Inputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetGrantDelayCall__Outputs.html" data-type="entity-link" >SetGrantDelayCall__Outputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetRoleAdminCall.html" data-type="entity-link" >SetRoleAdminCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetRoleAdminCall__Inputs.html" data-type="entity-link" >SetRoleAdminCall__Inputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetRoleAdminCall__Outputs.html" data-type="entity-link" >SetRoleAdminCall__Outputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetRoleGuardianCall.html" data-type="entity-link" >SetRoleGuardianCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetRoleGuardianCall__Inputs.html" data-type="entity-link" >SetRoleGuardianCall__Inputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetRoleGuardianCall__Outputs.html" data-type="entity-link" >SetRoleGuardianCall__Outputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetTargetAdminDelayCall.html" data-type="entity-link" >SetTargetAdminDelayCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetTargetAdminDelayCall__Inputs.html" data-type="entity-link" >SetTargetAdminDelayCall__Inputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetTargetAdminDelayCall__Outputs.html" data-type="entity-link" >SetTargetAdminDelayCall__Outputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetTargetClosedCall.html" data-type="entity-link" >SetTargetClosedCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetTargetClosedCall__Inputs.html" data-type="entity-link" >SetTargetClosedCall__Inputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetTargetClosedCall__Outputs.html" data-type="entity-link" >SetTargetClosedCall__Outputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetTargetFunctionRoleCall.html" data-type="entity-link" >SetTargetFunctionRoleCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetTargetFunctionRoleCall__Inputs.html" data-type="entity-link" >SetTargetFunctionRoleCall__Inputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetTargetFunctionRoleCall__Outputs.html" data-type="entity-link" >SetTargetFunctionRoleCall__Outputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/Stat.html" data-type="entity-link" >Stat</a>
                            </li>
                            <li class="link">
                                <a href="classes/StatDto.html" data-type="entity-link" >StatDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/TargetAdminDelayUpdated.html" data-type="entity-link" >TargetAdminDelayUpdated</a>
                            </li>
                            <li class="link">
                                <a href="classes/TargetAdminDelayUpdated-1.html" data-type="entity-link" >TargetAdminDelayUpdated</a>
                            </li>
                            <li class="link">
                                <a href="classes/TargetAdminDelayUpdated__Params.html" data-type="entity-link" >TargetAdminDelayUpdated__Params</a>
                            </li>
                            <li class="link">
                                <a href="classes/TargetClosed.html" data-type="entity-link" >TargetClosed</a>
                            </li>
                            <li class="link">
                                <a href="classes/TargetClosed-1.html" data-type="entity-link" >TargetClosed</a>
                            </li>
                            <li class="link">
                                <a href="classes/TargetClosed__Params.html" data-type="entity-link" >TargetClosed__Params</a>
                            </li>
                            <li class="link">
                                <a href="classes/TargetFunctionRoleUpdated.html" data-type="entity-link" >TargetFunctionRoleUpdated</a>
                            </li>
                            <li class="link">
                                <a href="classes/TargetFunctionRoleUpdated-1.html" data-type="entity-link" >TargetFunctionRoleUpdated</a>
                            </li>
                            <li class="link">
                                <a href="classes/TargetFunctionRoleUpdated__Params.html" data-type="entity-link" >TargetFunctionRoleUpdated__Params</a>
                            </li>
                            <li class="link">
                                <a href="classes/TestKoboImportDto.html" data-type="entity-link" >TestKoboImportDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/TokenCreated.html" data-type="entity-link" >TokenCreated</a>
                            </li>
                            <li class="link">
                                <a href="classes/TokenCreated-1.html" data-type="entity-link" >TokenCreated</a>
                            </li>
                            <li class="link">
                                <a href="classes/TokenCreated__Params.html" data-type="entity-link" >TokenCreated__Params</a>
                            </li>
                            <li class="link">
                                <a href="classes/TokenDetail.html" data-type="entity-link" >TokenDetail</a>
                            </li>
                            <li class="link">
                                <a href="classes/TokenMintedAndApproved.html" data-type="entity-link" >TokenMintedAndApproved</a>
                            </li>
                            <li class="link">
                                <a href="classes/TokenMintedAndApproved-1.html" data-type="entity-link" >TokenMintedAndApproved</a>
                            </li>
                            <li class="link">
                                <a href="classes/TokenMintedAndApproved__Params.html" data-type="entity-link" >TokenMintedAndApproved__Params</a>
                            </li>
                            <li class="link">
                                <a href="classes/TokenMintedAndSent.html" data-type="entity-link" >TokenMintedAndSent</a>
                            </li>
                            <li class="link">
                                <a href="classes/TokenMintedAndSent-1.html" data-type="entity-link" >TokenMintedAndSent</a>
                            </li>
                            <li class="link">
                                <a href="classes/TokenMintedAndSent__Params.html" data-type="entity-link" >TokenMintedAndSent__Params</a>
                            </li>
                            <li class="link">
                                <a href="classes/Transfer.html" data-type="entity-link" >Transfer</a>
                            </li>
                            <li class="link">
                                <a href="classes/Transfer-1.html" data-type="entity-link" >Transfer</a>
                            </li>
                            <li class="link">
                                <a href="classes/Transfer__Params.html" data-type="entity-link" >Transfer__Params</a>
                            </li>
                            <li class="link">
                                <a href="classes/TransferCall.html" data-type="entity-link" >TransferCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/TransferCall__Inputs.html" data-type="entity-link" >TransferCall__Inputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/TransferCall__Outputs.html" data-type="entity-link" >TransferCall__Outputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/TransferFromCall.html" data-type="entity-link" >TransferFromCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/TransferFromCall__Inputs.html" data-type="entity-link" >TransferFromCall__Inputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/TransferFromCall__Outputs.html" data-type="entity-link" >TransferFromCall__Outputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/TransferFromTokenCall.html" data-type="entity-link" >TransferFromTokenCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/TransferFromTokenCall__Inputs.html" data-type="entity-link" >TransferFromTokenCall__Inputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/TransferFromTokenCall__Outputs.html" data-type="entity-link" >TransferFromTokenCall__Outputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/TransferTokenCall.html" data-type="entity-link" >TransferTokenCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/TransferTokenCall__Inputs.html" data-type="entity-link" >TransferTokenCall__Inputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/TransferTokenCall__Outputs.html" data-type="entity-link" >TransferTokenCall__Outputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateAuthAppDto.html" data-type="entity-link" >UpdateAuthAppDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateAuthorityCall.html" data-type="entity-link" >UpdateAuthorityCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateAuthorityCall__Inputs.html" data-type="entity-link" >UpdateAuthorityCall__Inputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateAuthorityCall__Outputs.html" data-type="entity-link" >UpdateAuthorityCall__Outputs</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateBeneficiaryDto.html" data-type="entity-link" >UpdateBeneficiaryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateBeneficiaryGroupDto.html" data-type="entity-link" >UpdateBeneficiaryGroupDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProjectDto.html" data-type="entity-link" >UpdateProjectDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProjectStatusDto.html" data-type="entity-link" >UpdateProjectStatusDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateTokenDto.html" data-type="entity-link" >UpdateTokenDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ValidateWalletDto.html" data-type="entity-link" >ValidateWalletDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Vendor.html" data-type="entity-link" >Vendor</a>
                            </li>
                            <li class="link">
                                <a href="classes/VendorAddToProjectDto.html" data-type="entity-link" >VendorAddToProjectDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/VendorRegisterDto.html" data-type="entity-link" >VendorRegisterDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/VendorUpdateDto.html" data-type="entity-link" >VendorUpdateDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/VerifySignatureDto.html" data-type="entity-link" >VerifySignatureDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/VerifyVendorOtp.html" data-type="entity-link" >VerifyVendorOtp</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/ExternalAppGuard.html" data-type="entity-link" >ExternalAppGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AA.html" data-type="entity-link" >AA</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DocgenConfig.html" data-type="entity-link" >DocgenConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExtendedHardhatUserConfig.html" data-type="entity-link" >ExtendedHardhatUserConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/JobFilterOptions.html" data-type="entity-link" >JobFilterOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MicroserviceOptions.html" data-type="entity-link" >MicroserviceOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MicroserviceOptions-1.html" data-type="entity-link" >MicroserviceOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MicroserviceOptions-2.html" data-type="entity-link" >MicroserviceOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProjectActionFunc.html" data-type="entity-link" >ProjectActionFunc</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Vendor.html" data-type="entity-link" >Vendor</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/VendorCreateInput.html" data-type="entity-link" >VendorCreateInput</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});