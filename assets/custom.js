/*
* Broadcast Theme
*
* Use this file to add custom Javascript to Broadcast.  Keeping your custom
* Javascript in this fill will make it easier to update Broadcast. In order
* to use this file you will need to open layout/theme.liquid and uncomment
* the custom.js script import line near the bottom of the file.
*/
 $(document).ready(function(){
  $(".cstmbeforearow").click(function(){
    window.scrollTo(0, 0);
  });
    var current_fs, next_fs, previous_fs; //fieldsets
    var opacity;
    var current = 1;
    var steps = $("fieldset").length;

    setProgressBar(current);

    $(".next").click(function(){

      current_fs = $(this).parents('fieldset');
      next_fs = $(this).parents('fieldset').next();

      //Add Class Active
      $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

      //show the next fieldset
      next_fs.show();
      //hide the current fieldset with style
      current_fs.animate({opacity: 0}, {
        step: function(now) {
          opacity = 1 - now;

          current_fs.css({
            'display': 'none',
            'position': 'relative'
          });
          next_fs.css({'opacity': opacity,'display': 'flex'});
        },
        duration: 500
      });
      setProgressBar(++current);
    });

    $(".previous").click(function(){

      current_fs = $(this).parents('fieldset');
      previous_fs = $(this).parents('fieldset').prev();

      //Remove class active
      $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

      //show the previous fieldset
      previous_fs.show();

      //hide the current fieldset with style
      current_fs.animate({opacity: 0}, {
        step: function(now) {
          // for making fielset appear animation
          opacity = 1 - now;

          current_fs.css({
            'display': 'none',
            'position': 'relative'
          });
          previous_fs.css({'opacity': opacity, 'display': 'flex'});
        },
        duration: 500
      });
      setProgressBar(--current);
    });

    function setProgressBar(curStep){
      var percent = parseFloat(100 / steps) * curStep;
      percent = percent.toFixed();
      $(".progress-bar")
      .css("width",percent+"%")
    }

    $(".submit").click(function(){
      return false;
    })
    $(".FAQS_container").click(function(){
      var _index = $(this).find('.content_with-radio').attr('data-index');
      var _tipsHeading = $(this).find('.content_with-radio').attr('data-heading');
      var _tipsContent = $(this).find('.content_with-radio').attr('data-content');
      var _tipsImage = $(this).find('.img-sec').attr('data-src');
      localStorage.setItem('tipHeading_'+_index,  _tipsHeading);
      localStorage.setItem('tipContent_'+_index,  _tipsContent);
      localStorage.setItem('tipImage_'+_index,  _tipsImage);
      $(this).addClass('active').siblings().removeClass('active');
      $(this).parents('.Question-answer').find('.mainQuesQuizBtn .next').removeClass('disabled');
    });

   $('body').on('click','.mainQuesQuizBtnSubMitBtn', function(e){
      e.preventDefault();
      $('.mainQuizeSec4-flex').addClass('show');
      var _dataUrl = $(this).parents('.last_step').find('.FAQS_container.active .image-with-content').attr('data-url');
      var _dataIndex = $(this).parents('.last_step').find('.FAQS_container.active .image-with-content').attr('data-index');
      sessionStorage.setItem('pageDataUrl', _dataUrl);
      sessionStorage.setItem('pageDataIndex', _dataIndex);
      // window.location.href = _dataUrl;
       window.location.href = "/pages/quiz-intro";
    });

$(".quizname").keyup(Quizname);
  function Quizname (){
    var quiznames = $(".quizname").val();
    var alphabeticValue = quiznames.replace(/[^a-zA-Z\s]/g, '');
    var qcount = quiznames.replace(/[, ]/g, "").length;
    var qname_regex = /^[ A-Za-z ]*$/;
    if(qname_regex.test(quiznames) && qcount > 2){
      $('.quizname').css('border-bottom','1px solid green');
      $('#qnameerror').text(" ");
      return true;
    }
     else if(qcount < 3){
       $('.quizname').css('border-bottom','1px solid red');
       $('#qnameerror').text("Please enter your Name, use alphabetic characters only");
       return false;
     }
 }
  
$(".quizphone").keyup(Quizphone);
   
  function Quizphone (){
    var quizphone = $(".quizphone").val();
    var qphone_regex = /^[6789][0-9]{4}([ ]?)[0-9]{5}$/
    if(qphone_regex.test(quizphone) && quizphone.length == 10){
      $('.quizphone').css('border-bottom','1px solid green');
      $('#quizphoneerror').text(" ");
      return true;
    }
     else if(!qphone_regex.test(quizphone) && quizphone.length != 10){
       $('.quizphone').css('border-bottom','1px solid red');
       $('#quizphoneerror').text("Please enter a valid 10 digits Number");
       return false;
     }
 }
  $('body').on('click','.startBtn', async function(e){
      e.preventDefault();
      var quiznameresult = Quizname();
      var quizphoneresult = Quizphone();
      var _dataUrl = $(this).parents('.last_step').find('.FAQS_container.active .image-with-content').attr('data-url');
      var newg = sessionStorage.getItem('pageDataUrl', _dataUrl);
       if(quiznameresult === true && quizphoneresult === true){
        var name = $('.quizIntroInput[type="text"]').val();
        var email = $('.quizIntroInput[type="Email"]').val();
        var storedQuizData = localStorage.getItem("QuizQuestion");
        var storedQuizDataArr = JSON.parse(storedQuizData);
     if(name && email )
     {
        gtag('event', 'Quiz_submit', {
          'send_to': 'G-C1KL70NW4X',
          'Name': name,
          'Phone': email,
          'Quiz':storedQuizDataArr
        });
       
      let QuizuserData =   {
    "event_type": "Quiz_Submit",
    "user_identity": "Quiz_Submit",
    "phone":email,
    "data": {
        "name":name,
        "mob":email,
         "QuizQuestion":storedQuizDataArr
    }
}
               const url = "https://flow-builder.limechat.ai/builder/v1/event/create";
        const headers = {
            "Content-Type": "application/json",
            "x-limechat-access-token": "yCNVe4uf0VLjxB23PpIwEKJvccNKylzhJdeg9UlUTxOBDHdDF83Rr7IhqA7wRkih",
            "Accept": "application/json"
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(QuizuserData) // Convert data to JSON format
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            // Handle responseData in your UI as needed
        } catch (error) {
            console.error("Error:", error);
            // Handle errors in your UI
        }
     }
            var name = localStorage.getItem("name");
    var email = localStorage.getItem("email");
    var text1 = localStorage.getItem("tipHeading_1");
    var content1 = localStorage.getItem("tipContent_1");
    var text2 = localStorage.getItem("tipHeading_2");
    var content2 = localStorage.getItem("tipContent_2");
    var text3 = localStorage.getItem("tipHeading_3");
    var content3 = localStorage.getItem("tipContent_3");
    var text4 = localStorage.getItem("tipHeading_4");
    var content4 = localStorage.getItem("tipContent_4");
    console.log(text4 + content4);
	$.ajax({
		type: "POST",
		url: "https://myindiabazar.com/acnesquad_quiz/datastore/getquiz.php",
		data: {name:name, email:email, text1:text1, content1:content1, text2:text2, content2:content2, text3:text3, content3:content3, text4:text4, content4:content4},           
		cache: "false", 
		dataType: "text",
		success: function (result) {
			 console.log("result");
		},
		fail: function (result){
			// console.log(result)
		}
	});  
         window.location.href = newg;
         // alert("true");
       }
    });
  });

//quiz popup Code starts
var new_quizpage = window.location.href;
        if(new_quizpage == '/pages/quiz-acne'){
        localStorage.setItem('quiz-popup','true');
    }

   $(window).load(function(){
       if(localStorage.getItem('quiz-popup') != 'true'){
          $('.popup-wrap').delay(100).fadeIn(100);
    } else if (new Date().getTime() - localStorage.getItem('quiz-popup-close-date') >= 1800000) {
       // } else if (new Date().getTime() - localStorage.getItem('quiz-popup-close-date') >= 30000) {
         $('.popup-wrap').delay(100).fadeIn(100);
     }

    $('.btn-close, .quiz_btn, .popup-img, .mainQuesQuizBtnSubMitBtn').click(function() 
    {
        $('.popup-wrap').fadeOut(100);
        localStorage.setItem('quiz-popup','true');
        localStorage.setItem('quiz-popup-close-date', new Date().getTime());
        
    });

 });

//quiz popup Code Ends

(function() {
  $('body').on('click', '.QuizstartBtn', async function(){
    var name = $('.quizIntroInput[type="text"]').val();
    var email = $('.quizIntroInput[type="Email"]').val();  
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
  });
 let tgtCopybtn = document.getElementById("copybtn");
if (tgtCopybtn) {
  tgtCopybtn.addEventListener('click', async function () {
      let tgtQuizCopyData = document.getElementById("mycode");
     let tgtQuizCopyDataText =  tgtQuizCopyData.innerText;
     gtag('event', 'Quiz_code_copied', {
          'send_to': 'G-C1KL70NW4X',
          'copy data':tgtQuizCopyDataText
        });
      let finalCopyData = {
    "event_type": "Quiz_code_copied",
    "user_identity": "Quiz_code_copied",
    "phone": "string",
    "data": {
        "copy data":tgtQuizCopyDataText
    }
}
        const url = "https://flow-builder.limechat.ai/builder/v1/event/create";
        const headers = {
            "Content-Type": "application/json",
            "x-limechat-access-token": "yCNVe4uf0VLjxB23PpIwEKJvccNKylzhJdeg9UlUTxOBDHdDF83Rr7IhqA7wRkih",
            "Accept": "application/json"
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(finalCopyData) // Convert data to JSON format
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            // Handle responseData in your UI as needed
        } catch (error) {
            console.error("Error:", error);
            // Handle errors in your UI
        }
  })
}

  $('body').on('click', '.cart-item__remove, .cart__quantity button', function(){
    $('button.cart__checkout').css('pointer-events','none');
    
    setTimeout(function(){
      $('button.cart__checkout').css('pointer-events','painted');
    },3000);
  });
  // Add custom code below this line


  //Code to play only one video at a time on site
  var videos = document.getElementsByTagName("video"); 
for (var i = 0; i < videos.length; i++) {
    videos[i].addEventListener("click", function() {
        for (var j = 0; j < videos.length; j++) {
            if (videos[j] !== this) {
                videos[j].pause(); 
            }
        }

        if (this.paused) {
            this.play(); 
        } else {
            this.pause(); 
        }
    });
}

  if( $(window).width() <= 748){
    $('.product-grid--mobile-slider').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      dots: true,
      autoplay: false
    });
  }
  // $('body').on('click','.QuizstartBtn',function (e) {
  //  var quiz_input_value =  $(this).parents('.mainquizeintroBtmSlid').find('input').val() 
  //    if(quiz_input_value )
  //  {
  //     fbq('track', 'Start-Quiz',{
  //                 value: quiz_input_value,
  //               });
  //  return true;
  // }
  //   else{
  //     $(this).parents('.mainquizeintroBtmSlid').find('input').css('border-color','#ff0000');
  //     return false;
  //   }
  // });
  // $('.quizIntroInput').keyup(function(){
  //   $(this).css('border-color','#ccc');
  // });
  $('body').on('click','.checkout__top',function(){
    $('button[name="checkout"]').click();
  });
  $('.description_read_mr_btn').click(function(){
    $('html, body').animate({
      scrollTop: $(`[element-name="${$(this).attr('target-element')}"]`).offset().top - 80 }, 100);
  });

  $('body').on('click','.shop-by-stage-of-acne .navlink--grandchild, .shop-by-stage-of-acne .sub-menu-nav', function(e){
    e.preventDefault();
    var _href = $(this).attr('href');
    sessionStorage.setItem('pageDataUrl', null);
    sessionStorage.setItem('pageDataIndex', null);
    location.href = _href;
  });

  $('body').on('click','.faq_tabs_button', function(){
    $('.faq_tabs_button').not(this).removeClass('active');
    $(this).addClass('active');
    var dataClass = $(this).data('class');
    $('.faqs_all').css('display','none');
    $('.'+dataClass).css('display','block');
  });
if($(window).width() > 768){
  $('body').on('click','[data-quantity-plus]', function(){
    var qty = parseInt($(this).parent().find('.quantity__input').val());
      qty = qty + 1;
    $(this).parent().find('.quantity__input').val(qty);
  });
  $('body').on('click','[data-quantity-minus]', function(){
    var qty = parseInt($(this).parent().find('.quantity__input').val());
      qty = qty - 1;
    if(qty > 0){
    $(this).parent().find('.quantity__input').val(qty);
      }
  });
}
  if($(window).width() < 767){
    $('.sliderow_main_button').click(function(params) {
      $(this).parent().find('.mobile__menu__dropdown_11').slideToggle();
    });
  }
  $('body').on('click','.cart__checkout', function(e) {
    $('.loaderChekout').css('display','block');
    $('.loaderChekout-overlay').css('display','block');
    var tprice = $('[data-cart-total]').attr('sub-total');
    // console.log('tprice',tprice);
    // $.getJSON('/cart', function(cart){
      if(tprice > 60000 && tprice < 99900){
        $.ajax({
         type: 'POST',
         url: '/cart/update.js',
         data: {
           updates:{
            "43324853485805":0,
            "43324857975021":0
            }
          },
          dataType: 'json',
          async:false,  
          success: function(params) {
            location.href = '/checkout';
          }
        });
      }else if (tprice > 99900){
        $.ajax({
         type: 'POST',
         url: '/cart/update.js',
         data: {
           updates:{
            "43324853485805":0,
            "43324857975021":1
          }
         },
        dataType: 'json',
        async:false,  
          success: function(params) {
            location.href = '/checkout';
          }
      });
    }
    else if (tprice < 60000){
        $.ajax({
         type: 'POST',
         url: '/cart/update.js',
         data: {
           updates:{
            "43324853485805":0,
            "43324857975021":0
          }
         },
        dataType: 'json',
        async:false,  
          success: function(params) {
            location.href = '/checkout';
          }
      });
    }
  // });
  //   // For Gtag begin_checkout event
    let gtag_items_count = $(this).parents('#cart-dropdown').find('#cart_item_count').val();  
    let gtag_atc_price = $(this).parents('.cart__foot-inner').find('.cart__total [data-cart-total]').text().replace('₹','').trim();  
    gtag_begin_checkout(gtag_items_count,gtag_atc_price);
  });
  //   // function for Gtag Event 22/09/2022
     function gtag_add_to_cart(item_id,price) {
          gtag('event', 'add_to_cart', {
            'send_to': 'G-C1KL70NW4X',
            'value': price,
            'item_id': item_id,
            'currency': 'INR'
          });
        }
     function gtag_begin_checkout(items,price) {
        gtag('event', 'begin_checkout', {
          'send_to': 'G-C1KL70NW4X',
          'value': price,
          'item_count': items,
          'currency': 'INR'
        });
      }
 
  $('body').on('click','.product__submit__item [data-add-to-cart]', function(){
    // console.log("add_to_cart");
    let gtag_atc_vid = $(this).attr('variant_id');  
    let gtag_atc_price = $(this).attr('product_price');  
    gtag_add_to_cart(gtag_atc_vid,gtag_atc_price);
  });

  $('body').on('click','.quizeintonxtback .QuizstartBtn', function(){
    let quizUsername = $('.quizIntroInput').val();
    if(quizUsername.trim() !== ''){
      gtag('event', 'Quiz Start', {
        'send_to': 'AW-10987954470/8wxFCLfbjIAYEKbCu_co'
      });
    }
  });
  $('body').on('click','.mainQuesQuizBtnSubMitBtn', function(){
    gtag('event', 'Quiz Submit', {
      'send_to': 'AW-10987954470/zVkYCMTZjIAYEKbCu_co'
    });
     fbq('track', 'Quiz Submit',{
     value:'Quiz Submit',
                });
  });
//  _________________________ MAX LIMIT ________________________________________ 
  if(window.theme.showMaxLimit){
    $('.quantity__plus').click(function(){
      var max_limit = parseInt(window.theme.MaxLimit);
      var Val = $(this).parent().find('input[name=quantity]').val();
      if(Val >= max_limit){ 
        $(this).parent().find('input[name=quantity]').val(max_limit - 1);
        $(this).closest('form').parent().find('.dis_error-msg').html(window.theme.error_MaxLimit);
         $('.quantity__plus').css('pointer-events','none');
      }else{
        $(this).closest('form').parent().find('.dis_error-msg').html(" ");
        $('.quantity__plus').css('pointer-events','painted');
      }
    });
    $('.quantity__minus').click(function(){
       $('.quantity__plus').css('pointer-events','painted');
      $(this).closest('form').parent().find('.dis_error-msg').html(" ");
    });
  }
})();
var search_input = document.getElementById("stMobileSearchBox");

search_input.addEventListener('change', function(event)
{
    var search_input_value = event.target.value;
     console.log(search_input_value , "ll");
  
    fbq('track', 'Search-Product',{
    value: search_input_value,
});
})

  $(document).ready(function () {
const d = new Date();
      const options = { hour12: false };
      const dateAndTime = d.toLocaleString('en-US', options);
    // $('body').on('click', '.quiz_btn', function () {
    //     Moengage.track_event("Popup-Quiz Click", {
    //         "page_name": 'Home Page',
    //          "Date":dateAndTime

    //     });
    // })
//       let tgt_quiz_start = document.querySelector(".QuizstartBtn");
//     if (tgt_quiz_start) {
      
//        tgt_quiz_start.addEventListener('click', async function (e) {
//             let input_val_arr = []
//             let tgt_input = document.querySelectorAll(".quizIntroInput")
//             tgt_input.forEach((item) => {
//                 let item_value = item.value;
//                 if (item_value) {
//                     input_val_arr.push(item_value);
//                 }

//             })
//             localStorage.setItem("QuizEmail", input_val_arr[1]);
//             if (input_val_arr.length != 0) {
//                 const url = "https://flow-builder.limechat.ai/builder/v1/event/create";
// const headers = {
//   "Content-Type": "application/json",
//   "x-limechat-access-token": "yCNVe4uf0VLjxB23PpIwEKJvccNKylzhJdeg9UlUTxOBDHdDF83Rr7IhqA7wRkih",
//   "Accept": "application/json"
// };

// const data = {
//   event_type: "Quiz start Click",
//   user_identity: "string",
//   phone: "string",
//   data: {
//     name:input_val_arr[0],
//     email:input_val_arr[0],
//     first_name: "order start",
//     checkout_id:"",
//     order_id:"",
//   },
// };

// try {
//   const response = await fetch(url, {
//     method: "POST",
//     headers: headers,
//     body: JSON.stringify(data),
//   });

//   if (!response.ok) {
//     throw new Error(`HTTP error! Status: ${response.status}`);
//   }

//   const responseData = await response.json();
//   // Handle responseData in your UI as needed
// } catch (error) {
//   console.error("Error:", error);
//   // Handle errors in your UI
// }

//             }

//         })
//     }
  let submit_quiz = document.querySelector(".mainQuesQuizBtnSubMitBtn");
    console.log("submit_quiz" , submit_quiz)
if (submit_quiz) {
  submit_quiz.addEventListener('click', async function () {
    let quiz_submit_arr = [];
     var name = localStorage.getItem("name");
    var email = localStorage.getItem("QuizEmail");
    var text1 = localStorage.getItem("tipHeading_1");
    quiz_submit_arr.push(text1)
    var text2 = localStorage.getItem("tipHeading_2");
    quiz_submit_arr.push(text2)
    var text3 = localStorage.getItem("tipHeading_3");
    quiz_submit_arr.push(text3)
    var text4 = localStorage.getItem("tipHeading_4");
    quiz_submit_arr.push(text4)
    let tgt_quiz_question = document.querySelectorAll(".mainQuesDesTTL h3");
    let quiz_question_arr = []
    tgt_quiz_question.forEach((item, index) => {
      let quiz_question_text = item.innerText;
      quiz_question_arr.push(quiz_question_text);
    })
    // console.log("quiz_question_arr" , quiz_question_arr)
    let result = quiz_submit_arr.map((submit, index) => ({
      question: quiz_question_arr[index],
      Answer: submit   
    }));
localStorage.setItem("QuizQuestion", JSON.stringify(result));

  })
}

});

/* Pincode Validation on Product Page */
$(document).ready(function(){
  if(window.theme.pincodeValidatorEnable){
    var ExistPincode = localStorage.getItem('ExistPincode');
    var PinMsg = localStorage.getItem('PinMsg');
    
    const pin_list_1 = window.theme.pincodeList_1;
    const pin_list_2 = window.theme.pincodeList_2;  
    const pin_list_3 = window.theme.pincodeList_3;
    const pin_list_4 = window.theme.pincodeList_4; 
    
    $('.pincode-validate-btn').click(function(i){
      var pin_11 = $(this).parent('.pincode-validator').find('input.pincode-1');
      var pincode_11 = pin_11.val();
      
      if (/^(\d{6})$/.test(pincode_11)) {
        if ($.inArray(pincode_11, pin_list_1) > -1) {
          localStorage.setItem('ExistPincode', pincode_11);
          localStorage.setItem('storepincode', pincode_11);
          $('.pincode-1').attr('placeholder', 'Enter your shipping pincode').css('color','#02397f');
          $('.pincode-1').val(pincode_11);
          $('.cstm-msg').addClass('active');
          $('.cstm-msg1').removeClass('active');
          setTimeout(function() {
            $('.cstm-msg1').show();
          }, 2000);
          $('.pin_err_msg').hide();
        }else if ($.inArray(pincode_11, pin_list_2) > -1){
          localStorage.setItem('ExistPincode', pincode_11);
          localStorage.setItem('storepincode', pincode_11);
          $('.pincode-1').attr('placeholder', 'Enter your shipping pincode').css('color','#02397f');
          $('.pincode-1').val(pincode_11);
          $('.cstm-msg').addClass('active');
          $('.cstm-msg2').removeClass('active');
          setTimeout(function() {
            $('.cstm-msg2').show();
          }, 2000);
          $('.pin_err_msg').hide();
        }else if ($.inArray(pincode_11, pin_list_3) > -1){
          localStorage.setItem('ExistPincode', pincode_11);
          localStorage.setItem('storepincode', pincode_11);
          $('.pincode-1').attr('placeholder', 'Enter your shipping pincode').css('color','#02397f');
          $('.pincode-1').val(pincode_11);
          $('.cstm-msg').addClass('active');
          $('.cstm-msg3').removeClass('active');
          setTimeout(function() {
            $('.cstm-msg3').show();
          }, 2000);
          $('.pin_err_msg').hide();
        }else if ($.inArray(pincode_11, pin_list_4) > -1){
          localStorage.setItem('ExistPincode', pincode_11);
          localStorage.setItem('storepincode', pincode_11);
          $('.pincode-1').attr('placeholder', 'Enter your shipping pincode').css('color','#02397f');
          $('.pincode-1').val(pincode_11);
          $('.cstm-msg').addClass('active');
          $('.cstm-msg4').removeClass('active');
          setTimeout(function() {
            $('.cstm-msg4').show();
          }, 2000);
          $('.pin_err_msg').hide();
        }else{
          localStorage.setItem('ExistPincode', '');
          localStorage.setItem('storepincode', '');
          localStorage.setItem('PinMsg', '');
          $('.pincode-validation.product-pins').show();
          $('.cstm-msg').hide();
          setTimeout(function() {
            $('.pin_err_msg').show();
          }, 2000);
        }
      } else {
        pin_11.focus().attr('placeholder', 'Invalid PIN').css('color','red'); $('.pincode-1').val('');
        localStorage.setItem('PinMsg', '');
        $('.pincode-validation.product-pins').show();
        localStorage.setItem('ExistPincode', '');
        localStorage.setItem('storepincode', '');
        return false;
      }
      
      $('.waiting-content').show();
      setTimeout(function() {
        $('.waiting-content').hide();
      }, 2000);

      var wrong_pin = $('input.pincode-1').val();
      $('.wrong-pin').html('Delivery options for <span style="font-weight: bold;">' + wrong_pin + '</span>');

      $("input.pincode-1").focus(function(){
        $('.cstm-msg, .pin_err_msg').hide();
      });

      $('.pin-btn-hide').hide();

      $('.change-btn').click(function(e){
        $('.pin-btn-hide').show();
        $('.cstm-msg, .pin_err_msg').hide();
        event.preventDefault();
      });

      printCity(pincode_11);
    });   

    function printCity(pincode) {
      $.getJSON(`https://api.postalpincode.in/pincode/${pincode}`, function(data) {
        if (data[0].Status === 'Success') {
          var data_pincodes = data[0].PostOffice[0].Pincode;
          var data_country = data[0].PostOffice[0].Country;
          var city_new;
          if (data[0].PostOffice[0].Block === 'NA') {
            city_new = data[0].PostOffice[0].District;
          } else {
            city_new = data[0].PostOffice[0].Block;
          }
          var display_pincode = `${pincode}`;
          var city_country = `${city_new}, ${data_country}`;
          $('.display-pincode').html('Delivery options for <span style="font-weight: bold;">' + display_pincode + '</span>');
          $('.city-country').html('<i class="fas fa-shipping-fast" style="color: #AA9CF7; font-size: 14px;"></i> Shipping to: <span style="font-weight: bold;">' + city_country + '</span>');
        } else {
          var wrong_pin = $('input.pincode-1').val();
          $('.display-pincode').html('Delivery options for <span style="font-weight: bold;">' + wrong_pin + '</span>');
          $('.city-country').text('');
        }
      });
    }
  }
});
/* Pincode Validation on Product Page */

$(document).ready(function () {
const currentTime = new Date();
const hours = currentTime.getHours();
const minutes = currentTime.getMinutes();
const seconds = currentTime.getSeconds();
const formattedTime = `${hours}:${minutes}:${seconds}`;
    $('body').on('click', '.quiz_btn', async function () {
       gtag('event', 'Quiz_Pop_up_click', {
          'send_to': 'G-C1KL70NW4X',
           'Date':formattedTime
        });
        let data = {
            "event_type": "Quiz_Pop_up_click",
            "user_identity": "Quiz_Pop_up_click",
            "phone": "string",
            "data": {
                "Event name": "Quiz_Pop_up_click",
                'Date':formattedTime
            }
        };

        const url = "https://flow-builder.limechat.ai/builder/v1/event/create";
        const headers = {
            "Content-Type": "application/json",
            "x-limechat-access-token": "yCNVe4uf0VLjxB23PpIwEKJvccNKylzhJdeg9UlUTxOBDHdDF83Rr7IhqA7wRkih",
            "Accept": "application/json"
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(data) // Convert data to JSON format
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            // Handle responseData in your UI as needed
        } catch (error) {
            console.error("Error:", error);
            // Handle errors in your UI
        }
      
    });
      // console.log("window.location.href" , window.location.href)
  if(window.location.href == "https://www.acnesquad.com/pages/quiz-acne")
  {
   async function  QuizStart ()
      {
        gtag('event', 'Quiz_Start', {
          'send_to': 'G-C1KL70NW4X',
           'Date':formattedTime
        });
        let tgtQuizStart = {
    "event_type": "Quiz_Start",
    "user_identity": "Quiz_Start",
    "phone": "Quiz_Start",
    "data": {
      "Event name": "Quiz_Start"
    }
  }
  const url = "https://flow-builder.limechat.ai/builder/v1/event/create";
  const headers = {
    "Content-Type": "application/json",
    "x-limechat-access-token": "yCNVe4uf0VLjxB23PpIwEKJvccNKylzhJdeg9UlUTxOBDHdDF83Rr7IhqA7wRkih",
    "Accept": "application/json"
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(tgtQuizStart) // Convert data to JSON format
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    // Handle responseData in your UI as needed
  } catch (error) {
    console.error("Error:", error);
    // Handle errors in your UI
  }
      }
    QuizStart()
  }
});
