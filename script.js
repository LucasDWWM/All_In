// Gestion des onglets
    const tabButtons = document.querySelectorAll('button.tab-btn');
    const toolSections = document.querySelectorAll('section.tool');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tool = btn.getAttribute('data-tool');
        toolSections.forEach(s => {
          s.id === tool ? s.classList.add('active') : s.classList.remove('active');
        });
      });
    });

    // OCR avec Tesseract.js
    const imageInputOCR = document.getElementById('imageInputOCR');
    const ocrResult = document.getElementById('ocrResult');
    const loadingIndicator = document.getElementById('loading');

    imageInputOCR.addEventListener('change', () => {
      const file = imageInputOCR.files[0];
      if (!file) return;

      loadingIndicator.style.display = 'block';
      ocrResult.value = '';

      Tesseract.recognize(
        file,
        'fra',
        { logger: m => console.log(m) }
      ).then(({ data: { text } }) => {
        loadingIndicator.style.display = 'none';
        ocrResult.value = text;
      }).catch(err => {
        loadingIndicator.style.display = 'none';
        ocrResult.value = 'Erreur lors de l\'extraction du texte.';
        console.error(err);
      });
    });

    // PNG vers PDF avec jsPDF
    const jsPDF = window.jspdf.jsPDF;
    const imageInputPDF = document.getElementById('imageInputPDF');
    const convertBtn = document.getElementById('convertBtn');

    imageInputPDF.addEventListener('change', () => {
      convertBtn.disabled = !imageInputPDF.files.length;
    });

    convertBtn.addEventListener('click', () => {
      const file = imageInputPDF.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (e) {
        const imgData = e.target.result;
        const pdf = new jsPDF();
        const img = new Image();
        img.onload = function () {
          const imgWidth = pdf.internal.pageSize.getWidth();
          const imgHeight = (img.height * imgWidth) / img.width;
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
          pdf.save('image-to-pdf.pdf');
        };
        img.src = imgData;
      };
      reader.readAsDataURL(file);
    });