/*
==========================================================
NDOW Volunteer Portal
Login Background
==========================================================
*/

const LoginBackground = {

    currentImage: 0,

    initialize(){

        this.showRandomImage();

    },

    showRandomImage(){

        const background =

            document.getElementById(
                'loginBackground'
            );

        if(!background)
            return;

        let image;

        do{

            image =

                Math.floor(

                    Math.random() *

                    LoginConfig.imageCount

                ) + 1;

        }

        while(

            LoginConfig.preventRepeat &&

            image ===

            LoginStorage.getLastImage()

        );

        LoginStorage.setLastImage(

            image

        );

        this.currentImage = image;

        background.style.opacity = 0;

        setTimeout(() => {

            background.style.backgroundImage =

                `url(${LoginConfig.imagePath}image-${image}.${LoginConfig.imageExtension})`;

            background.style.opacity = 1;

        },

        LoginConfig.fadeDuration / 2);

    }

};
