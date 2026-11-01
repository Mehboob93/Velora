
(() => {
  "use strict";

  /* ---- 1. Form validation  ---- */
  document.addEventListener("submit", (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;

    if (form.classList.contains("needs-validation")) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        form.classList.add("was-validated");
        const firstInvalid = form.querySelector(":invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      form.classList.add("was-validated");
    }

    const message = form.dataset.confirm;
    if (message && !window.confirm(message)) {
      event.preventDefault();
      return;
    }

   
    if (form.dataset.submitting === "true") {
      event.preventDefault();
      return;
    }
    const button = form.querySelector("button[data-loading]");
    if (button) {
      form.dataset.submitting = "true";
      button.classList.add("is-loading");
      button.setAttribute("aria-busy", "true");
      button.setAttribute("aria-label", button.dataset.loading);
    }
  });

  // Coming back via the browser's back button should not leave buttons stuck in the loading state.
  window.addEventListener("pageshow", () => {
    document.querySelectorAll("form[data-submitting]").forEach((f) => delete f.dataset.submitting);
    document.querySelectorAll(".btn.is-loading").forEach((b) => {
      b.classList.remove("is-loading");
      b.removeAttribute("aria-busy");
      b.removeAttribute("aria-label");
    });
  });

  /* ---- 2. Flash messages: success notices dismiss themselves ---- */
  window.addEventListener("load", () => {
    document.querySelectorAll("[data-autodismiss]").forEach((el) => {
      setTimeout(() => {
        if (window.bootstrap && document.body.contains(el)) bootstrap.Alert.getOrCreateInstance(el).close();
      }, 6000);
    });
  });

  /* ---- 3. Home search panel: swap budget options between Buy and Rent ---- */
  const panel = document.querySelector("[data-search-panel]");
  if (panel) {
    const budgets = panel.querySelectorAll("[data-budget]");
    const sync = () => {
      const mode = panel.querySelector('input[name="type"]:checked').value;
      budgets.forEach((select) => {
        const active = select.dataset.budget === mode;
        select.hidden = !active;
        select.disabled = !active;
        if (!active) select.value = "";
      });
    };
    panel.querySelectorAll('input[name="type"]').forEach((r) => r.addEventListener("change", sync));
    sync();
  }

  /* ---- 4.Display total after taxes---- */
  const taxToggle = document.querySelector("[data-tax-toggle]");
  const grid = document.getElementById("listing-grid");
  if (taxToggle && grid) {
    taxToggle.addEventListener("change", () => grid.classList.toggle("show-tax", taxToggle.checked));
  }

  /* ---- 5. Details page gallery and lightbox ---- */
  const gallery = document.querySelector("[data-gallery]");
  if (gallery) {
    const mainImg = gallery.querySelector("[data-gallery-main]");
    const thumbs = gallery.querySelectorAll("[data-gallery-thumb]");
    let currentOriginal = thumbs.length ? thumbs[0].dataset.original : mainImg.src;

    thumbs.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        mainImg.src = thumb.dataset.full;
        currentOriginal = thumb.dataset.original;
        thumbs.forEach((t) => t.classList.toggle("is-active", t === thumb));
      });
    });

    const lightbox = document.getElementById("lightbox");
    if (lightbox) {
      lightbox.addEventListener("show.bs.modal", () => {
        lightbox.querySelector("[data-lightbox-img]").src = currentOriginal;
      });
    }
  }

  /* ---- 6. New / edit form: preview the chosen photo ---- */
  const fileInput = document.querySelector("[data-image-input]");
  const preview = document.querySelector("[data-image-preview]");
  if (fileInput && preview) {
    fileInput.addEventListener("change", () => {
      const file = fileInput.files && fileInput.files[0];
      if (!file) {
        preview.classList.remove("is-visible");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert("That image is larger than 10 MB. Please choose a smaller photo.");
        fileInput.value = "";
        preview.classList.remove("is-visible");
        return;
      }
      preview.src = URL.createObjectURL(file);
      preview.classList.add("is-visible");
    });
  }

  /* ---- 7. Error page "Go back" button ---- */
  document.querySelectorAll("[data-go-back]").forEach((btn) => {
    if (window.history.length <= 1) btn.hidden = true;
    btn.addEventListener("click", () => window.history.back());
  });
})();
