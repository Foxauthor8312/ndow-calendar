/*
==========================================================
NDOW Volunteer Portal
Login Background Manager
==========================================================
*/

const LoginBackground = {

    backgrounds: [],

    activeIndex: 0,

    imageDeck: [],

    deckPosition: 0,

    initialize(){

        this.backgrounds = [

            document.getElementById(
                'loginBackgroundA'
            ),

            document.getElementById(
                'loginBackgroundB'
            )

        ];

        this.buildDeck();

        this.showNextImage(true);

    },

    buildDeck(){

        this.imageDeck = [];

        for(

            let i = 1;

            i <= LoginConfig.imageCount;

            i++

        ){

            this.imageDeck.push(i);

        }

        // Fisher-Yates Shuffle

        for(

            let i =

                this.imageDeck.length - 1;

            i > 0;

            i--

        ){

            const j =

                Math.floor(

                    Math.random() *

                    (i + 1)

                );

            [

                this.imageDeck[i],

                this.imageDeck[j]

            ] = [

                this.imageDeck[j],

                this.imageDeck[i]

            ];

        }

        this.deckPosition = 0;

    },

    getNextImage(){

        if(

            this.deckPosition >=

            this.imageDeck.length

        ){

            this.buildDeck();

        }

        return this.imageDeck[
            this.deckPosition++
        ];

    },

    showNextImage(

        immediate = false

    ){

        const image =

            this.getNextImage();

        const next =

            1 - this.activeIndex;

        const currentLayer =

            this.backgrounds[
                this.activeIndex
            ];

        const nextLayer =

            this.backgrounds[
                next
            ];

        nextLayer.style.backgroundImage =

            `url(${LoginConfig.imagePath}image-${image}.${LoginConfig.imageExtension})`;

        if(immediate){

            nextLayer.style.opacity = 1;

            currentLayer.style.opacity = 0;

            this.activeIndex = next;

            return;

        }

        nextLayer.style.opacity = 1;

        currentLayer.style.opacity = 0;

        this.activeIndex = next;

    }

};
