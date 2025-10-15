(function ($) {
  "use strict";

  $(document).ready(function () {

    const mfnSelect = $(".mfn-vr-select.attribute_pa_sposob-pokupki");

    if (mfnSelect.length > 0) {
      
      const buttonContainer = $('<div class="custom-variation-buttons"></div>');

      mfnSelect.find("option").each(function () {
        const option = $(this);
        const value = option.val();
        const text = option.text();

        if (value === "") {
          return;
        }

        const button = $('<div class="variation-button"></div>');
        button.attr("data-value", value);
        button.text(text);
        
        buttonContainer.append(button);
      });

      mfnSelect.parent().after(buttonContainer);

      buttonContainer.on("click", ".variation-button", function () {
        const clickedButton = $(this);
        const valueToSelect = clickedButton.attr("data-value");

        mfnSelect.val(valueToSelect).trigger("change");
      });
      
      mfnSelect.on('change', function(){
        const currentValue = $(this).val();
        buttonContainer.find('.variation-button').removeClass('active');
        if (currentValue) {
          buttonContainer.find(`.variation-button[data-value="${currentValue}"]`).addClass('active');
        }
      });

      setTimeout(function() {
        if ( ! mfnSelect.val() ) {
          const defaultOption = mfnSelect.find('option').filter(function () {
              return $(this).text().indexOf('Погонный метр') !== -1;
          });

          if (defaultOption.length > 0) {
              mfnSelect.val(defaultOption.val()).trigger('change');
          }
        } else {
            mfnSelect.trigger('change');
        }
      }, 100);
    }
  });
})(jQuery);