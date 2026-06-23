window.openCreateAssignmentRequest =
  function(){

    const modal =
      document.getElementById(
        'createAssignmentRequestModal'
      );

    alert(
      modal
        ? 'Modal exists'
        : 'Modal NOT found'
    );

    if(modal){

      modal.classList.remove(
        'hidden'
      );

      modal.style.display =
        'block';

      modal.style.zIndex =
        '99999';

    }

  };
