window.replaceWizzyTemplate = (ele) => {
  let newDiv = document.getElementById(ele + "-new");
  let oldDiv = document.getElementById(ele);
  if (!newDiv || !oldDiv) {
    console.log("new template not updated");
    return;
  }
  newDiv = newDiv.text;
  oldDiv.text = newDiv;
};

const colorCode = {
  "2197C": "#74D2E7",
  "1777C": "#FB637E",
  "3385C": "#47D7AC",
  "150C": "#FFB25B",
  "2283C": "#a7e163",
};
window.onWizzyScriptLoaded = () => {
  $('[href="/search"]').attr("href", "/pages/search");
  $('[action="/search"]').attr("action", "/pages/search");
  window.replaceWizzyTemplate("wizzy-search-results-product");
  window.replaceWizzyTemplate("wizzy-autocomplete-topproducts");
  window.replaceWizzyTemplate("wizzy-search-empty-results");

  console.log("======>", "onWizzyScriptLoaded", "<======");

  const wizzyHeaderStaticObserverHandler = (target) => {
    let headerEle = $(target);
    let isStickey = headerEle.hasClass("is-not-visible");
    let bodyEle = $("body");
    if (isStickey) {
      bodyEle.addClass("wizzy-sticky-header");
    } else {
      bodyEle.removeClass("wizzy-sticky-header");
    }
  };
  const wizzyCartDrawerObserverHandler = (target) => {
    let headerEle = $(target);
    let isCartOpned = headerEle.hasClass("is-open");

    if (isCartOpned) {
      $(".wizzy-tocart-button.adding").removeClass("adding");
    }
  };
  const wizzyMenuDrawerObserverHandler = (target) => {
    let headerEle = $(target);
    let isMenuOpened = headerEle.hasClass("drawer--visible");

    if (isMenuOpened) {
      $("body").addClass("wizzy-offcanvas-drawer-visible");
    } else {
      $("body").removeClass("wizzy-offcanvas-drawer-visible");
    }
  };
  const wizzyHeaderStaticObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutationRecord) {
      wizzyHeaderStaticObserverHandler(mutationRecord.target);
    });
  });
  const wizzyCartDrawerObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutationRecord) {
      wizzyCartDrawerObserverHandler(mutationRecord.target);
    });
  });
  const wizzyMenuDrawerObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutationRecord) {
      wizzyMenuDrawerObserverHandler(mutationRecord.target);
    });
  });

  wizzyMenuDrawerObserver.observe(document.getElementById("header-menu"), {
    attributes: true,
    attributeFilter: ["class"],
  });
  wizzyHeaderStaticObserver.observe(
    document.getElementById("wizzy-header-custom-section"),
    { attributes: true, attributeFilter: ["class"] }
  );
  wizzyCartDrawerObserver.observe(document.getElementById("cart-dropdown"), {
    attributes: true,
    attributeFilter: ["class"],
  });

  let isAutocompleteMutationConfigured = false;
  const setMutatationToAutocomplete = (id, options = {}) => {
    if (isAutocompleteMutationConfigured) return;
    let mutationHandler = (target) => {
      let targetEle = $(target);
      //  console.log(targetEle.find('.wizzy-autocomplete-wrapper').css('display'),'<=====autocomplete')
      let isVisible =
        targetEle.find(".wizzy-autocomplete-wrapper").css("display") == "flex";
      if (isVisible) {
        $("body").addClass("wizzy-autocomplete-is-visible");
        $("body").removeClass("wizzy-autocomplete-is-not-visible");
      } else {
        $("body").removeClass("wizzy-autocomplete-is-visible");
        $("body").addClass("wizzy-autocomplete-is-not-visible");
      }
    };
    let mutationStaticObserver = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutationRecord) {
        switch (mutationRecord.type) {
          case "childList":
            //          console.log('mutation type =>',mutationRecord.type);
            //console.log('mutation target =>',$(mutationRecord.target).find('.wizzy-autocomplete-wrapper'));
            mutationHandler(mutationRecord.target);
            break;
          case "subtree":
            console.log("mutation type =>", mutationRecord.type);
            break;
          default:
          // mutationHandler(mutationRecord.target);
        }
      });
    });
    mutationStaticObserver.observe(document.getElementById(id), options);
    console.log("wizzy = > mution setMutatationToAutocomplete ");
    isAutocompleteMutationConfigured = true;
  };
  let autocompleteId = ".wizzy-body-end-wrapper";
  $(autocompleteId).attr("id", "wizzy-body-end-wrapper");
  setMutatationToAutocomplete("wizzy-body-end-wrapper", {
    subtree: true,
    childList: true,
    attributes: true,
  });

  window.wizzyConfig.events.registerEvent(
    window.wizzyConfig.events.allowedEvents.BEFORE_INIT,
    function (payload) {
    //  typePhrase();
      payload.common.lazyDOMConfig.searchInputIdentifiers = [];
      payload.store.currency.symbol = "₹ ";
      if (window.screen.width < 768) {
        payload.search.configs.general.noOfProducts = 10;
        payload.common.lazyDOMConfig.searchInputIdentifiers.push({
          dom: "#stMobileSearchBox input",
          type: "text",
        });
      } else {
        
        payload.common.lazyDOMConfig.searchInputIdentifiers.push({
          dom: "#wizzyDesktopSearchBox",
          type: "text",
        });
      }
      payload.search.configs.noProductsFound = {
        showProducts: true,
        defaultPool: {
          method: "filters",
          expiry: "session",
          data: {
            productsCount: 7,
            categories: ["serum-collection"],
          },
        },
      };
      return payload;
    }
  );

  const formatter = new Intl.NumberFormat("en-IN", {
    // style: 'currency',
    // currency: 'INR',
    minimumFractionDigits: 0,
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

  window.wizzyConfig.events.registerEvent(
    window.wizzyConfig.events.allowedEvents.AFTER_PRODUCTS_TRANSFORMED,
    function (productList) {
      try {
        for (let i in productList) {
          if (productList[i].hoverImage) {
            new Image().src = productList[i].hoverImage;
          }
          if (productList[i].mainImage) {
            new Image().src = productList[i].mainImage;
          }

          let foundCustAttributes = productList[i].attributes.filter(
            (v) => v.id == "product_collectiontitle_description_custom"
          );
          if (foundCustAttributes && foundCustAttributes.length > 0) {
            productList[i].customDataOne =
              foundCustAttributes[0].values[0].value[0];
          } else {
            productList[i].customDataOne = false;
          }

          let handle = productList[i].attributes.filter(
            (v) => v.id == "product_handle"
          )[0].values[0].value[0];
          if (handle) {
            productList[i].handle = handle;
          } else {
            productList[i].handle = false;
          }

          let themeColor = productList[i].attributes.filter(
            (v) => v.id == "product_color_code_pantone_custom"
          );
          if (themeColor && themeColor.length > 0) {
            themeColor = themeColor[0].values[0].value[0];
            themeColor = themeColor.trim();
            productList[i].themeColor = themeColor;
            if (colorCode.hasOwnProperty(themeColor)) {
              productList[i].themeColorHex = colorCode[themeColor];
            }
          }

          let reviews = productList[i].attributes.filter(
            (v) => v.id == "product_reviews_spr"
          );
          if (typeof reviews[0] == "object") {
            reviews = reviews[0].values[0].value[0];
            let reviewsEle = $("<div>").html(reviews);
            let reviewStatus = JSON.parse(reviewsEle.find("script").text());
            if (reviewStatus) {
              productList[i].avgRatings = reviewStatus.ratingValue;
              productList[i].totalReviews = reviewStatus.reviewCount;
            }
          }

          let variantId = productList[i].attributes.filter(
            (v) => v.id == "product_variant_ids"
          )[0].values[0].value[0];
          productList[i].variantId = variantId;
        }
      } catch (error) {
        console.error(error);
      }

      return productList;
    }
  );
  window.wizzyConfig.events.registerEvent(
    window.wizzyConfig.events.allowedEvents.VIEW_RENDERED,
    function () {
      //   $('.wizzyMobileTapped').removeClass('wizzyMobileTapped');
    }
  );
  window.wizzyConfig.events.registerEvent(
    window.wizzyConfig.events.allowedEvents.PRODUCTS_RESULTS_RENDERED,
    function () {
      $("body").removeAttr("id");
      $("body").removeClass("wizzy-empty-result-found");
      if ($("body").hasClass("wizzy-autocomplete-is-visible")) {
        $("body").removeClass("wizzy-autocomplete-is-visible");
        $("body").addClass("wizzy-autocomplete-is-not-visible");
      }
      let allProducts = $("[data-wizzy-custom-data]");
      console.log(allProducts, "<=======data-wizzy-custom-data");

      for (let i in allProducts) {
        if (typeof allProducts[i] == "object") {
          let htmlToDisplay = $(allProducts[i]).val();
          let productDiv = $(allProducts[i]).parents(
            ".wizzy-product-item-price-reviews-wrapper"
          );
          let wizzyCustom = productDiv.find(".wizzy-cutom-data");
          wizzyCustom.html(htmlToDisplay);
        }
      }
    }
  );

  //$('#stMobileSearchBox input').attr('readonly','readonly');
  $("body").on("submit", ".wizzy-tocart-form", (e) => {
    e.preventDefault();
    let formEle = $(e.target);
    let buttonEle = formEle.find("[type=submit]")[0];
    buttonEle = $(buttonEle).addClass("adding");
    // setTimeout(()=>{
    //   buttonEle.removeClass('adding');
    // },1000);

    console.log(buttonEle, "<=====buttonEle");
    cart.addToCart(formEle.serialize());
    console.log("product added to cart init");
  });
  $("body").on("click", "#stMobileSearchBox input", (e) => {
    // $('.wizzy-search-form').addClass('mobileTapped');
    // $('#search_mini_form input')[0].click();
  });
  $("body").on("click", ".autocomplete-link", (e) => {
    // $(".wizzy-search-back .wizzy-icon")[0].click();
  });
  // $('body').on('click','.autocomplete-text-wrapper',(e)=>{
  //     $('.wizzy-search-form').addClass('mobileTapped');
  //     $('#search_mini_form input')[0].click();
  //   });

  $("body").on(
    "click",
    ".header__mobile .header__mobile__left .header__mobile__button",
    (e) => {
      if ($("body").hasClass("wizzy-autocomplete-is-visible")) {
        $("body").removeClass("wizzy-autocomplete-is-visible");
        $("body").addClass("wizzy-autocomplete-is-not-visible");
      }
    }
  );
  // View all button
  $("body").on("click", ".wizzy-view-more", function () {
    $(".wz-search-from").submit();
  });
  // default suggestion url

  const shopUrlMaker=(path)=>{
  let urlList=[
    window.location.origin,
    path
  ];
   return urlList.join('/') ;
  }
  $("body").on("click", ".autocomplete-link", (e) => {
    let searchedTerm = $(e.target).attr("data-searchterm");
    if (searchedTerm == "face cleanser") {
      e.stopImmediatePropagation();
      window.location.href =
        "/products/kick-start-cleanser-with-salicylic-acid-thymol-t-essence";
    }
    
    if (searchedTerm == "serums") {
      e.stopImmediatePropagation();
      window.location.href = shopUrlMaker("collections/serum-collection");
    }
    if (searchedTerm == "clogged pores") {
      e.stopImmediatePropagation();
      window.location.href = shopUrlMaker("collections/stage-2");
    }
    if (searchedTerm == "spot correctors") {
      e.stopImmediatePropagation();
      window.location.href = shopUrlMaker("collections/spot-correctors");
    }
    if (searchedTerm == "combos") {
      e.stopImmediatePropagation();
      window.location.href = shopUrlMaker("collections/combo");
    }
  });

  typePhrase();
};

// Wizzy Animated Placeholder function declare:-
let placeholderText;
if (screen.width >= 768) {
  placeholderText = document.getElementById("wizzyDesktopSearchBox");
}
if (screen.width <= 768) {
  placeholderText = document.getElementById("wizzyMobileSearchBox");
}
const phrases = [
  "Search for Cleanser",
  "Search for Clogged Pores",
  "Search for Serums",
];
let index = 0;
let typingTimer;
function typePhrase() {
  const phrase = phrases[index];
  const len = phrase.length;
  let i = 0;
  typingTimer = setInterval(function () {
    if (i === len) {
      clearInterval(typingTimer);
      setTimeout(erasePhrase, 1000); // Wait for 1 second before erasing
    } else {
      const currentText = placeholderText.getAttribute("placeholder");
      placeholderText.setAttribute(
        "placeholder",
        currentText + phrase.charAt(i)
      );
      i++;
    }
  }, 100); // Change the speed of typing by changing this value
}

function erasePhrase() {
  const currentText = placeholderText.getAttribute("placeholder");
  const len = currentText.length;
  let i = len - 1;
  typingTimer = setInterval(function () {
    if (i === -1) {
      clearInterval(typingTimer);
      index++;
      if (index === phrases.length) {
        index = 0;
      }
      setTimeout(typePhrase, 1000); // Wait for 1 second before typing the next phrase
    } else {
      const newText = currentText.slice(0, i);
      placeholderText.setAttribute("placeholder", newText);
      i--;
    }
  }, 50); // Change the speed of erasing by changing this value
}
