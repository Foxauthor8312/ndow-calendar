/*
==========================================================
NDOW Volunteer Portal
Login Background
==========================================================
*/

const LoginBackground = {

    initialize(){

        this.loadImage(1);

    },

    loadImage(number){

        const background =
            document.getElementById(
                'loginBackground'
            );

        if(!background)
            return;

        background.style.backgroundImage =
            `url(images/login/image-${number}.webp)`;

        requestAnimationFrame(() => {

            background.style.opacity = 1;

        });

    }

};
