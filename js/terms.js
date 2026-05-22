// ========================================
// TERMS VERSION
// ========================================

const TERMS_VERSION = '1.0';

// ========================================
// CHECK TERMS ACCEPTANCE
// ========================================

async function checkTermsAcceptance(){

  return new Promise(resolve => {

    const user = JSON.parse(
      localStorage.getItem('user')
    );

    if(!user){

      resolve();

      return;

    }

    const accepted =
      localStorage.getItem(
        'termsAccepted_' +
        user.username
      );

    if(
      accepted === TERMS_VERSION
    ){

      resolve();

      return;

    }

    window.termsResolve = resolve;

    document.getElementById(
  'termsModal'
).style.display =
  'block';

  });

}

// ========================================
// MONITOR TERMS SCROLL
// ========================================

function monitorTermsScroll(){

  const container =
    document.getElementById(
      'termsScrollContainer'
    );

  const checkbox =
    document.getElementById(
      'termsCheckbox'
    );

  const reachedBottom =
    container.scrollTop +
    container.clientHeight >=
    container.scrollHeight - 20;

  if(reachedBottom){

    checkbox.disabled = false;

  }

}

// ========================================
// TOGGLE TERMS ACCEPTANCE
// ========================================

function toggleTermsAcceptance(){

  const checked =
    document.getElementById(
      'termsCheckbox'
    ).checked;

  document.getElementById(
    'acceptTermsButton'
  ).disabled = !checked;

}

// ========================================
// ACCEPT TERMS
// ========================================

async function acceptTerms(){

  const user = JSON.parse(
    localStorage.getItem('user')
  );

  if(!user){
    return;
  }

  localStorage.setItem(
    'termsAccepted_' +
    user.username,
    TERMS_VERSION
  );

  document.getElementById(
  'termsModal'
).style.display =
  'none';

  if(window.termsResolve){

    window.termsResolve();

  }

}
