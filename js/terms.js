.terms-modal {

  position:fixed;
  inset:0;

  background:rgba(0,0,0,.82);

  z-index:99999;

  display:flex;
  align-items:center;
  justify-content:center;

  padding:20px;

}

.terms-content {

  width:min(900px,100%);
  height:min(88vh,920px);

  background:#111827;
  color:#f9fafb;

  border-radius:18px;

  display:flex;
  flex-direction:column;

  overflow:hidden;

  border:1px solid #374151;

  box-shadow:
    0 0 40px rgba(0,0,0,.45);

}

.terms-content h2 {

  margin:0;

  padding:24px;

  background:#0f172a;

  color:white;

  border-bottom:1px solid #374151;

  font-size:26px;

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

  margin-bottom:20px;

  color:#e5e7eb;

}

.terms-scroll-container h3 {

  margin-top:34px;
  margin-bottom:14px;

  color:#93c5fd;

  font-size:18px;

}

.terms-footer {

  border-top:1px solid #374151;

  background:#0f172a;

  padding:22px 26px;

  display:flex;
  flex-direction:column;

  gap:18px;

}

.terms-checkbox-row {

  display:flex;
  align-items:flex-start;

  gap:12px;

  color:#f3f4f6;

  line-height:1.6;

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

  padding:12px 22px;

  border-radius:10px;

  font-weight:600;

  cursor:pointer;

}

#acceptTermsButton:hover {

  background:#1d4ed8;

}

#acceptTermsButton:disabled {

  opacity:.45;

  cursor:not-allowed;

}
