.hidden {
  display:none !important;
}

.terms-modal {

  position:fixed !important;

  top:0;
  left:0;
  right:0;
  bottom:0;

  width:100vw;
  height:100vh;

  background:rgba(0,0,0,.88);

  z-index:999999;

  display:flex;
  align-items:center;
  justify-content:center;

  padding:24px;

}

.terms-content {

  width:min(920px,100%);
  height:min(88vh,920px);

  background:#111827;

  color:#f9fafb;

  border-radius:18px;

  overflow:hidden;

  display:flex;
  flex-direction:column;

  border:1px solid #374151;

  box-shadow:
    0 0 50px rgba(0,0,0,.65);

}

.terms-content h2 {

  margin:0;

  padding:24px;

  background:#0f172a;

  color:white;

  font-size:26px;

  border-bottom:1px solid #374151;

}

.terms-scroll-container {

  flex:1;

  overflow-y:auto;

  padding:28px;

  background:#111827;

  color:#f3f4f6;

  line-height:1.9;

  font-size:15px;

}

.terms-scroll-container p {

  color:#e5e7eb;

  margin-bottom:20px;

}

.terms-scroll-container h3 {

  margin-top:32px;
  margin-bottom:12px;

  color:#93c5fd;

}

.terms-footer {

  padding:22px 26px;

  background:#0f172a;

  border-top:1px solid #374151;

  display:flex;
  flex-direction:column;

  gap:18px;

}

.terms-checkbox-row {

  display:flex;

  gap:12px;

  align-items:flex-start;

  line-height:1.7;

  color:#f3f4f6;

}

.terms-checkbox-row input {

  margin-top:4px;

  transform:scale(1.15);

}

.terms-buttons {

  display:flex;

  justify-content:flex-end;

}

#acceptTermsButton {

  background:#2563eb;

  color:white;

  border:none;

  padding:12px 24px;

  border-radius:10px;

  font-weight:700;

  cursor:pointer;

}

#acceptTermsButton:hover {

  background:#1d4ed8;

}

#acceptTermsButton:disabled {

  opacity:.45;

  cursor:not-allowed;

}
