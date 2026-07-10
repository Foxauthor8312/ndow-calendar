/*
==========================================================
NDOW Volunteer Portal
Login Storage
==========================================================
*/

const LoginStorage = {

    getLastImage(){

        return Number(
            localStorage.getItem(
                'ndow_last_login_image'
            )
        );

    },

    setLastImage(image){

        localStorage.setItem(

            'ndow_last_login_image',

            image

        );

    },

    clear(){

        localStorage.removeItem(
            'ndow_last_login_image'
        );

    }

};
