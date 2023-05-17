$(document).ready(function(){
    var text_with_wallets = "";
    var text_without_wallets = "";
    $("#copy_result").click(function() {
        copyText("result_text");
    })
    
    $("#show_text").click(function() {
        $("#raw_text").toggleClass("hidden")
    })

    $("#closer").click(function() {
        $("#raw_text").toggleClass("hidden")
    })

    $("#compare_btn").click(function() {
        compareData();
    })

    $("#extract_data").click(function() {
        extractData();
    })

    $("#extract_data_bsc").click(function() {
        extractDataBsc();
    })

    

    $("#wallet_toggle").click(function() {
        walletToggle();
    })

    function walletToggle() {
        // include/exclude wallets in raw text 
        $("#wallet_toggle").toggleClass("with-wallets");
        if($("#wallet_toggle").hasClass("with-wallets")) {
            $("#result_text").val(text_with_wallets);
            $("#wallet_toggle")[0].innerText = "exclude wallets";
        }
        else {
            $("#result_text").val(text_without_wallets);
            $("#wallet_toggle")[0].innerText = "include wallets";
        }
        
    }

    function extractDataBsc() {
        let html_text = $("#t_data").val();
        let html_array = html_text.split("<li ");
        let data = [];
        console.log(html_array[5]);
        let raw_text = ``;
        for(let i = 2; i < html_array.length; i++) {
            let sub_array = html_array[i].split("?a=");
            // let from = sub_array[1].split(`\">`)[0];
            let to = sub_array[2].split(`\">`)[0];
            let amount = sub_array[2].split(`">`)[5].split(' ')[0];
            let obj = {
                wallet: to,
                amount: amount
            }
            raw_text += `${to} ${amount}\n`;
            data.push(obj);
        }
        $("#t_data").val(raw_text);
    }
    

    function extractData() {
        let html_text = $("#t_data").val();
        let html_array = html_text.split("<div");
        let data = [];
        let raw_text = ``;
        for(let i = 3; i < html_array.length; i++) {
            let sub_array = html_array[i].split("<a");
            let address = sub_array[2].split('?a=')[1].split(`"><span`)[0];
            let amount = sub_array[2].split(`"tooltip">`)[2].split(`</span>`)[0];
            let obj = {
                wallet: address,
                amount: amount
            }
            raw_text += `${address} ${amount}\n`;
            data.push(obj);
        }
        $("#t_data").val(raw_text);
        console.log(data);
    }

    

    

    function compareData() {
        let sData = $("#s_data").val();
        let tData = $("#t_data").val();
        var s_array = sData.split('\n');

        

        
        var temp_t_array = tData.split('\n');
        var t_array = [];



        for(let i = 0; i < temp_t_array.length; i++) {
            let obj = {
                wallet: temp_t_array[i].split(' ')[0],
                amount: temp_t_array[i].split(' ')[1]
            }
            t_array.push(obj);
        }

        var result_array = [];
        for(let i = 0; i < s_array.length; i++) {
            let wallet = s_array[i];
            let amount = 0.0;
            let match = false;
            for(let j = 0; j < t_array.length; j++) {
                if(wallet.toLowerCase() == t_array[j].wallet.toLowerCase()) {
                    let amm = t_array[j].amount.replace(',', '');
                    amount += parseFloat(amm);
                    match = true;
                }
            }
            text_with_wallets += `${wallet} ${amount}\n`;
            text_without_wallets += `${amount}\n`;
            
            let text = `<tr class="${match ? "match" : "not-match"}">
                <td>${wallet}</td>
                <td>${match}</td>
                <td>${amount}</td>
            </tr>`;
            let obj = {
                wallet: wallet,
                amount: amount
            }
            result_array.push(obj);
            
            $('#result_table').append(text);
        }
        $('#result_text').val(text_with_wallets);

        for(let i = 0; i < t_array.length; i++) {
            let wallet = t_array[i].wallet;
            let amm = t_array[i].amount.replace(',', '');
            let amount = parseFloat(amm);
            let match = false;
            for(let j = 0; j < s_array.length; j++) {
                if(wallet.toLowerCase() == s_array[j].toLowerCase()) {
                    match = true;
                }
            }
            if(!match) {
                let text = `<tr>
                    <td>${wallet}</td>
                    <td>${amount}</td>
                </tr>`;
                $("#t_result_table").append(text);
            }
        }

    }

    function copyText(id) {
        // Get the text field
        let text_element = document.getElementById(id);
        let text = text_element.value;
      
        // Copy the text inside the text field
        navigator.clipboard.writeText(text);
        
        // Alert
        alert("text copied");
      }
})