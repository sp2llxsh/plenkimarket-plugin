(function ($) {
  "use strict";

  $(document).ready(function () {
    const form = $("form.variations_form");
    if (form.length === 0) return;
    const totalContainer = $("#dynamic-total-price-container");
    const productContainer = $('.product');

    function calculateAndUpdateTotal() {
        const priceWrapper = form.find(".woocommerce-variation-price span.price");
        const priceHtml = priceWrapper.find(".woocommerce-Price-amount.amount").html();
        if (typeof priceHtml === "undefined") { totalContainer.empty(); return; }
        let quantity = parseFloat(form.find("input.qty").val());
        if (isNaN(quantity) || quantity < 1) { quantity = 1; }
        let priceText = priceHtml.replace(/<[^>]*>/g, "");
        let priceNumber = parseFloat(priceText.replace(/\s/g, "").replace(",", "."));
        if (isNaN(priceNumber)) { totalContainer.empty(); return; }
        let totalPrice = priceNumber * quantity;
        let currencySymbol = priceWrapper.find(".woocommerce-Price-currencySymbol").text();
        const totalLabelText = " / итого";
        let formattedTotal = `
            <span class="dynamic-total-amount">${totalPrice.toLocaleString("ru-RU", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}${currencySymbol}</span>
            <span class="dynamic-total-label">${totalLabelText}</span>
        `;
        totalContainer.html(`<div class="dynamic-total-wrapper">${formattedTotal}</div>`);
    }

    function setupQuantitySlider(variation) {
      const quantityInput = form.find("input.qty");
      let max_val = 20, unit = 'шт';
      const attrKey = 'attribute_pa_sposob-pokupki';
      const selectedAttribute = variation.attributes[attrKey];
      const rulonValue = '%d1%80%d1%83%d0%bb%d0%be%d0%bd'; 
      const metrValue = '%d0%bf%d0%be%d0%b3%d0%be%d0%bd%d0%bd%d1%8b%d0%b9-%d0%bc%d0%b5%d1%82%d1%80';

      if (selectedAttribute === rulonValue) {
        unit = 'шт';
        if (variation.max_qty > 0) { max_val = variation.max_qty; } else { max_val = 20; }
      } else if (selectedAttribute === metrValue) {
        unit = 'м';
        max_val = 20;
      }

      if ($('.custom-quantity-slider').length === 0) {
        const sliderHtml = `
          <div class="custom-quantity-slider">
            <input type="range" id="quantity_slider" min="1" max="${max_val}" value="1" step="1">
            <div class="slider-info">
              <span id="slider_min_value">1 ${unit}</span>
              <span id="slider_current_value">1 ${unit}</span>
              <span id="slider_max_value">${max_val} ${unit}</span>
            </div>
          </div>
        `;
        $('.custom-variation-buttons').after(sliderHtml);
      } else {
        $('#quantity_slider').attr('max', max_val).val(1);
        form.find("input.qty").val(1);
        $('#slider_min_value').text(`1 ${unit}`);
        $('#slider_max_value').text(`${max_val} ${unit}`);
        $('#slider_current_value').text(`1 ${unit}`);
      }
    }

    $(document).on('input', '#quantity_slider', function() {
        const currentValue = $(this).val();
        const unit = $('#slider_min_value').text().split(' ')[1] || 'м';
        $('#slider_current_value').text(`${currentValue} ${unit}`);
        form.find("input.qty").val(currentValue).trigger('change');
    });

    form.on("show_variation", function (event, variation) {
      form.find(".quantity").hide();
      setupQuantitySlider(variation);
      
      productContainer.removeClass('variation-selected-roll variation-selected-meter');
      const attrKey = 'attribute_pa_sposob-pokupki';
      const selectedAttribute = variation.attributes[attrKey];
      if (selectedAttribute === '%d1%80%d1%83%d0%bb%d0%be%d0%bd') {
        productContainer.addClass('variation-selected-roll');
      } else if (selectedAttribute === '%d0%bf%d0%be%d0%b3%d0%be%d0%bd%d0%bd%d1%8b%d0%b9-%d0%bc%d0%b5%d1%82%d1%80') {
        productContainer.addClass('variation-selected-meter');
      }
      
      setTimeout(function(){ form.find("input.qty").trigger('change'); }, 50);
    });

    form.on("hide_variation", function () {
      $('.custom-quantity-slider').remove();
      form.find(".quantity").show();
      totalContainer.empty();
      productContainer.removeClass('variation-selected-roll variation-selected-meter');
    });
    
    form.on("change", "input.qty", calculateAndUpdateTotal);
  });
})(jQuery);