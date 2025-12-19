<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hadilike - Fleuriste d'Émotion Marrakech</title>
    
    <script src="https://cdn.tailwindcss.com"></script>
    
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        serif: ['Playfair Display', 'serif'],
                        sans: ['Lato', 'sans-serif'],
                    },
                    colors: {
                        'brand-bg': '#FAFAFA', // Blanc cassé / Crème léger
                        'brand-black': '#1A1A1A',
                        'brand-stone': '#D6D3D1',
                    }
                }
            }
        }
    </script>

    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">

    <style>
        /* Styles spécifiques pour masquer la barre de défilement tout en gardant le scroll */
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        /* Animation douce */
        .fade-in {
            animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body class="bg-brand-bg text-brand-black font-sans antialiased selection:bg-brand-stone selection:text-white">

    <header class="fixed top-0 w-full bg-brand-bg/95 backdrop-blur-sm z-50 border-b border-stone-200">
        <div class="max-w-md mx-auto px-6 py-4 flex justify-between items-center">
            <button class="text-brand-black hover:text-stone-600 transition">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                </svg>
            </button>

            <h1 onclick="resetApp()" class="font-serif text-2xl font-bold tracking-wider cursor-pointer">HADILIKE</h1>

            <a href="#" class="text-brand-black hover:text-green-600 transition">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                </svg>
            </a>
        </div>
    </header>

    <main class="pt-24 pb-12 max-w-md mx-auto min-h-screen px-6">
        
        <div id="home-view" class="fade-in">
            <h2 class="font-serif text-3xl text-center mb-2">L'Art Floral</h2>
            <p class="text-center text-stone-500 mb-8 text-sm uppercase tracking-widest">Marrakech</p>
            
            <div class="space-y-4">
                <button onclick="startWizard('Bouquets')" class="w-full group relative overflow-hidden h-32 rounded-lg bg-stone-200 shadow-sm transition hover:shadow-md">
                    <div class="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition">
                        <span class="font-serif text-xl text-white tracking-wide">Bouquets</span>
                    </div>
                    <div class="w-full h-full bg-gradient-to-r from-stone-300 to-stone-400"></div>
                </button>

                <button onclick="startWizard('Boites à fleurs')" class="w-full group relative overflow-hidden h-32 rounded-lg bg-stone-200 shadow-sm transition hover:shadow-md">
                    <div class="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition">
                        <span class="font-serif text-xl text-white tracking-wide">Boites à fleurs</span>
                    </div>
                    <div class="w-full h-full bg-gradient-to-r from-stone-400 to-stone-300"></div>
                </button>

                <button onclick="startWizard('Composition spéciale')" class="w-full group relative overflow-hidden h-32 rounded-lg bg-stone-200 shadow-sm transition hover:shadow-md">
                    <div class="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition">
                        <span class="font-serif text-xl text-white tracking-wide">Composition Spéciale</span>
                    </div>
                    <div class="w-full h-full bg-gradient-to-r from-stone-300 to-stone-400"></div>
                </button>

                <div class="grid grid-cols-2 gap-4 mt-4">
                    <button onclick="showContact('Événements')" class="h-24 rounded-lg border border-stone-300 flex flex-col items-center justify-center hover:bg-stone-50 transition">
                        <span class="font-serif text-lg">Événements</span>
                        <span class="text-xs text-stone-500 uppercase mt-1">Sur Mesure</span>
                    </button>
                    <button onclick="showContact('Décoration')" class="h-24 rounded-lg border border-stone-300 flex flex-col items-center justify-center hover:bg-stone-50 transition">
                        <span class="font-serif text-lg">Décoration</span>
                        <span class="text-xs text-stone-500 uppercase mt-1">Floral Art</span>
                    </button>
                </div>
            </div>
        </div>

        <div id="wizard-view" class="hidden fade-in">
            <div class="flex items-center justify-between mb-8">
                <button onclick="prevStep()" class="text-sm text-stone-500 hover:text-black flex items-center gap-1">
                    ← Retour
                </button>
                <span class="text-xs uppercase tracking-widest text-stone-400">Étape <span id="step-number">1</span>/6</span>
            </div>

            <div id="step-1" class="step-content">
                <h3 class="font-serif text-2xl mb-6">Quelle est l'occasion ?</h3>
                <div class="grid grid-cols-2 gap-4">
                    <button onclick="selectOption('occasion', 'Amour')" class="option-btn p-4 border border-stone-300 rounded hover:bg-stone-100 hover:border-black transition">Amour</button>
                    <button onclick="selectOption('occasion', 'Anniversaire')" class="option-btn p-4 border border-stone-300 rounded hover:bg-stone-100 hover:border-black transition">Anniversaire</button>
                    <button onclick="selectOption('occasion', 'Plaisir')" class="option-btn p-4 border border-stone-300 rounded hover:bg-stone-100 hover:border-black transition">Plaisir d'offrir</button>
                    <button onclick="selectOption('occasion', 'Deuil')" class="option-btn p-4 border border-stone-300 rounded hover:bg-stone-100 hover:border-black transition">Deuil</button>
                </div>
            </div>

            <div id="step-2" class="step-content hidden">
                <h3 class="font-serif text-2xl mb-6">L'Esprit du bouquet</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div onclick="selectOption('style', 'Bohème')" class="cursor-pointer group">
                        <div class="h-32 bg-stone-200 rounded mb-2 group-hover:bg-stone-300 transition"></div>
                        <p class="text-center font-serif">Bohème</p>
                    </div>
                    <div onclick="selectOption('style', 'Romantique')" class="cursor-pointer group">
                        <div class="h-32 bg-stone-200 rounded mb-2 group-hover:bg-stone-300 transition"></div>
                        <p class="text-center font-serif">Romantique</p>
                    </div>
                    <div onclick="selectOption('style', 'Pureté')" class="cursor-pointer group">
                        <div class="h-32 bg-stone-200 rounded mb-2 group-hover:bg-stone-300 transition"></div>
                        <p class="text-center font-serif">Pureté</p>
                    </div>
                    <div onclick="selectOption('style', 'Surprise')" class="cursor-pointer group">
                        <div class="h-32 bg-stone-800 rounded mb-2 group-hover:bg-black transition flex items-center justify-center">
                            <span class="text-white text-2xl">?</span>
                        </div>
                        <p class="text-center font-serif">Surprise du Chef</p>
                    </div>
                </div>
            </div>

            <div id="step-3" class="step-content hidden">
                <h3 class="font-serif text-2xl mb-2">Inspiration <span id="selected-style-display"></span></h3>
                <p class="text-sm text-stone-500 mb-6 italic">"Chaque création est unique et dépend de l'arrivage du matin."</p>
                
                <div class="grid grid-cols-2 gap-2 mb-8">
                    <div class="h-40 bg-stone-200 rounded"></div>
                    <div class="h-40 bg-stone-300 rounded"></div>
                    <div class="h-40 bg-stone-300 rounded"></div>
                    <div class="h-40 bg-stone-200 rounded"></div>
                </div>
                
                <button onclick="nextStep()" class="w-full py-4 bg-brand-black text-white rounded font-serif tracking-wide hover:bg-stone-800 transition">
                    Continuer vers le budget
                </button>
            </div>

            <div id="step-4" class="step-content hidden">
                <h3 class="font-serif text-2xl mb-6">Votre Budget</h3>
                <div class="space-y-3">
                    <button onclick="selectOption('budget', '400dh')" class="w-full p-4 border border-stone-300 rounded flex justify-between hover:border-black hover:bg-stone-50 transition">
                        <span>Le Petit Geste</span>
                        <span class="font-bold">400 dh</span>
                    </button>
                    <button onclick="selectOption('budget', '700dh')" class="w-full p-4 border border-stone-300 rounded flex justify-between hover:border-black hover:bg-stone-50 transition">
                        <span>Le Plaisir</span>
                        <span class="font-bold">700 dh</span>
                    </button>
                    <button onclick="selectOption('budget', '1200dh')" class="w-full p-4 border border-stone-300 rounded flex justify-between hover:border-black hover:bg-stone-50 transition">
                        <span>L'Exception</span>
                        <span class="font-bold">1 200 dh</span>
                    </button>
                    <button onclick="selectOption('budget', '2000dh')" class="w-full p-4 border border-stone-300 rounded flex justify-between hover:border-black hover:bg-stone-50 transition">
                        <span>La Folie</span>
                        <span class="font-bold">2 000 dh</span>
                    </button>
                </div>
            </div>

            <div id="step-5" class="step-content hidden">
                <h3 class="font-serif text-2xl mb-6">Détails de livraison</h3>
                
                <div class="space-y-6">
                    <div>
                        <label class="block text-sm uppercase tracking-wide text-stone-500 mb-2">Message Carte</label>
                        <textarea id="msg-input" rows="3" class="w-full p-3 bg-white border border-stone-300 rounded focus:border-black focus:ring-0 outline-none" placeholder="Votre mot doux..."></textarea>
                    </div>

                    <div>
                        <label class="block text-sm uppercase tracking-wide text-stone-500 mb-2">Date de livraison</label>
                        <input type="date" id="date-input" class="w-full p-3 bg-white border border-stone-300 rounded focus:border-black outline-none mb-2">
                        <p id="date-warning" class="text-xs text-orange-600 hidden">Il est plus de 14h, livraison pour aujourd'hui impossible.</p>
                    </div>

                    <div>
                         <label class="block text-sm uppercase tracking-wide text-stone-500 mb-2">Créneau</label>
                         <div class="flex gap-4">
                             <label class="flex items-center gap-2 cursor-pointer">
                                 <input type="radio" name="slot" value="Matin" class="accent-black"> Matin
                             </label>
                             <label class="flex items-center gap-2 cursor-pointer">
                                 <input type="radio" name="slot" value="Soir" class="accent-black"> Soir
                             </label>
                         </div>
                    </div>

                    <button onclick="validateStep5()" class="w-full py-4 bg-brand-black text-white rounded font-serif tracking-wide mt-4 hover:bg-stone-800 transition">
                        Voir le récapitulatif
                    </button>
                </div>
            </div>

             <div id="step-6" class="step-content hidden">
                <h3 class="font-serif text-2xl mb-6">Récapitulatif</h3>
                
                <div class="bg-white p-6 rounded shadow-sm border border-stone-100 mb-6">
                    <p class="text-sm text-stone-500 uppercase tracking-widest mb-1">Catégorie</p>
                    <p id="summary-category" class="font-serif text-xl mb-4 text-black"></p>
                    
                    <div class="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                            <span class="text-stone-500">Occasion:</span> <br>
                            <span id="summary-occasion" class="font-bold"></span>
                        </div>
                        <div>
                            <span class="text-stone-500">Style:</span> <br>
                            <span id="summary-style" class="font-bold"></span>
                        </div>
                        <div>
                            <span class="text-stone-500">Budget:</span> <br>
                            <span id="summary-budget" class="font-bold"></span>
                        </div>
                        <div>
                            <span class="text-stone-500">Date:</span> <br>
                            <span id="summary-date" class="font-bold"></span>
                        </div>
                    </div>
                    
                    <p class="text-sm text-stone-500">Message :</p>
                    <p id="summary-message" class="italic text-stone-800 font-serif"></p>
                </div>

                <button onclick="alert('Commande simulée ! Redirection vers paiement...')" class="w-full py-4 bg-brand-black text-white rounded font-serif tracking-wide hover:bg-stone-800 transition shadow-lg">
                    Commander (<span id="btn-price"></span>)
                </button>
            </div>
        </div>

        <div id="contact-view" class="hidden fade-in">
             <button onclick="resetApp()" class="mb-6 text-sm text-stone-500 hover:text-black flex items-center gap-1">← Retour Accueil</button>
             <h2 class="font-serif text-3xl mb-2" id="contact-title">Contact</h2>
             <p class="text-stone-600 mb-6">Pour les demandes sur-mesure, nous préférons un échange direct.</p>
             
             <form class="space-y-4" onsubmit="event.preventDefault(); alert('Message envoyé !'); resetApp();">
                 <input type="text" placeholder="Votre Nom" class="w-full p-3 bg-white border border-stone-300 rounded outline-none focus:border-black">
                 <input type="tel" placeholder="Téléphone" class="w-full p-3 bg-white border border-stone-300 rounded outline-none focus:border-black">
                 <textarea placeholder="Décrivez votre projet..." rows="4" class="w-full p-3 bg-white border border-stone-300 rounded outline-none focus:border-black"></textarea>
                 <button class="w-full py-4 bg-brand-black text-white rounded font-serif tracking-wide">Envoyer la demande</button>
             </form>
        </div>

    </main>

    <script>
        // --- ETAT DE L'APPLICATION ---
        const state = {
            category: '',
            occasion: '',
            style: '',
            budget: '',
            message: '',
            date: '',
            slot: ''
        };

        let currentStep = 1;

        // --- NAVIGATION VUES ---
        function resetApp() {
            document.getElementById('home-view').classList.remove('hidden');
            document.getElementById('wizard-view').classList.add('hidden');
            document.getElementById('contact-view').classList.add('hidden');
            currentStep = 1;
            resetForm();
        }

        function showContact(type) {
            document.getElementById('home-view').classList.add('hidden');
            document.getElementById('contact-view').classList.remove('hidden');
            document.getElementById('contact-title').innerText = type;
        }

        function startWizard(categoryName) {
            state.category = categoryName;
            document.getElementById('home-view').classList.add('hidden');
            document.getElementById('wizard-view').classList.remove('hidden');
            showStep(1);
        }

        // --- NAVIGATION WIZARD ---
        function showStep(stepIndex) {
            // Masquer toutes les étapes
            document.querySelectorAll('.step-content').forEach(el => el.classList.add('hidden'));
            // Afficher l'étape actuelle
            document.getElementById(`step-${stepIndex}`).classList.remove('hidden');
            document.getElementById('step-number').innerText = stepIndex;
            currentStep = stepIndex;

            // Logique spécifique pour l'étape 3 (Mise à jour texte)
            if(stepIndex === 3) {
                document.getElementById('selected-style-display').innerText = state.style;
            }

            // Logique spécifique pour l'étape 5 (Datepicker Restriction)
            if(stepIndex === 5) {
                initDatepicker();
            }

            // Logique spécifique pour l'étape 6 (Résumé)
            if(stepIndex === 6) {
                fillSummary();
            }
        }

        function nextStep() {
            if (currentStep < 6) {
                showStep(currentStep + 1);
            }
        }

        function prevStep() {
            if (currentStep > 1) {
                showStep(currentStep - 1);
            } else {
                resetApp();
            }
        }

        // --- LOGIQUE DE SELECTION ---
        function selectOption(key, value) {
            state[key] = value;
            // Animation ou feedback visuel possible ici
            console.log(`Selected ${key}: ${value}`);
            nextStep();
        }

        // --- VALIDATION ETAPE 5 (Formulaire) ---
        function validateStep5() {
            const msg = document.getElementById('msg-input').value;
            const date = document.getElementById('date-input').value;
            const slotEl = document.querySelector('input[name="slot"]:checked');
            
            if (!date || !slotEl) {
                alert("Veuillez choisir une date et un créneau.");
                return;
            }

            state.message = msg;
            state.date = date;
            state.slot = slotEl.value;
            nextStep();
        }

        // --- LOGIQUE DATE (Règle des 14h) ---
        function initDatepicker() {
            const dateInput = document.getElementById('date-input');
            const warningText = document.getElementById('date-warning');
            
            const now = new Date();
            const currentHour = now.getHours();
            
            let minDate = new Date();

            // Si il est plus de 14h00
            if (currentHour >= 14) {
                // On ajoute 1 jour
                minDate.setDate(minDate.getDate() + 1);
                warningText.classList.remove('hidden');
            } else {
                warningText.classList.add('hidden');
            }

            // Format YYYY-MM-DD pour l'input
            const formattedDate = minDate.toISOString().split('T')[0];
            dateInput.min = formattedDate;
        }

        // --- REMPLISSAGE RESUME ---
        function fillSummary() {
            document.getElementById('summary-category').innerText = state.category;
            document.getElementById('summary-occasion').innerText = state.occasion;
            document.getElementById('summary-style').innerText = state.style;
            document.getElementById('summary-budget').innerText = state.budget;
            document.getElementById('summary-date').innerText = `${state.date} (${state.slot})`;
            document.getElementById('summary-message').innerText = state.message || "Aucun message";
            document.getElementById('btn-price').innerText = state.budget;
        }

        function resetForm() {
            // Reset visuel simple
            document.getElementById('msg-input').value = "";
            document.getElementById('date-input').value = "";
            const radios = document.querySelectorAll('input[type="radio"]');
            radios.forEach(r => r.checked = false);
        }

    </script>
</body>
</html>