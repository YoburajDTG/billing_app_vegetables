// Tanglish (Romanized Tamil) to English vegetable name mapping
export const tanglishMap = {
    // Onion family
    'vengayam': 'onion',
    'vengaya': 'onion',
    'venkayam': 'onion',
    'sambar vengayam': 'shallot',
    'chinna vengayam': 'shallot',

    // Tomato
    'thakkali': 'tomato',
    'thakali': 'tomato',
    'takkali': 'tomato',

    // Potato
    'urulaikizhangu': 'potato',
    'urulai': 'potato',
    'urulaikilangu': 'potato',

    // Brinjal/Eggplant
    'kathirikkai': 'brinjal',
    'katharikai': 'eggplant',
    'kathiri': 'brinjal',

    // Ladyfinger/Okra
    'vendakkai': 'ladyfinger',
    'vendakai': 'okra',
    'vendai': 'okra',

    // Coriander
    'kothamalli': 'coriander',
    'kothimalli': 'coriander',
    'kothamalli ilai': 'coriander',

    // Garlic
    'poondu': 'garlic',
    'vellaipoondu': 'garlic',
    'vellai poondu': 'garlic',

    // Ginger
    'inji': 'ginger',
    'allam': 'ginger',

    // Chilli/Pepper
    'milagai': 'chilli',
    'milaga': 'chilli',
    'pachai milagai': 'green chilli',
    'sivappu milagai': 'red chilli',

    // Carrot
    'carrot': 'carrot',
    'karot': 'carrot',

    // Beans
    'beans': 'beans',
    'avarakkai': 'beans',
    'avarakai': 'beans',

    // Cabbage
    'cabbage': 'cabbage',
    'muttaikose': 'cabbage',
    'muttai kose': 'cabbage',

    // Cauliflower
    'cauliflower': 'cauliflower',
    'gobi': 'cauliflower',

    // Spinach/Greens
    'palak': 'spinach',
    'keerai': 'greens',
    'pasalai keerai': 'spinach',

    // Drumstick
    'murungakkai': 'drumstick',
    'murunga': 'drumstick',
    'murungai': 'drumstick',

    // Bitter gourd
    'pavakkai': 'bitter gourd',
    'pagarkai': 'bitter gourd',

    // Bottle gourd
    'sorakkai': 'bottle gourd',
    'suraikai': 'bottle gourd',

    // Ridge gourd
    'peerkangai': 'ridge gourd',
    'peerkankai': 'ridge gourd',

    // Snake gourd
    'pudalangai': 'snake gourd',
    'pudal': 'snake gourd',

    // Ash gourd
    'poosanikai': 'ash gourd',
    'pusanikai': 'white pumpkin',

    // Pumpkin
    'parangikai': 'pumpkin',
    'parangi': 'pumpkin',

    // Cucumber
    'vellarikai': 'cucumber',
    'vellari': 'cucumber',

    // Radish
    'mullangi': 'radish',
    'mulangi': 'radish',

    // Beetroot
    'beetroot': 'beetroot',
    'bit': 'beetroot',

    // Lemon
    'elumichai': 'lemon',
    'elumicham pazham': 'lemon',
    'nimbu': 'lemon',

    // Curry leaves
    'kariveppilai': 'curry leaves',
    'karivepilai': 'curry leaves',
    'karuveppilai': 'curry leaves',

    // Mint
    'pudina': 'mint',
    'puthina': 'mint',

    // Green peas
    'pattani': 'green peas',
    'patani': 'peas',

    // Cluster beans
    'kothavarangai': 'cluster beans',
    'kothavarankai': 'cluster beans',
};

// Function to search with Tanglish support
export const searchWithTanglish = (searchTerm) => {
    const lowerSearch = searchTerm.toLowerCase().trim();

    // Check if the search term matches any Tanglish word
    if (tanglishMap[lowerSearch]) {
        return tanglishMap[lowerSearch];
    }

    // Return original search term if no match
    return lowerSearch;
};
