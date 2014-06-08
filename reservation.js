function checkReserved(row, seat, reservedArr) {
	for (var i=0; i<reservedArr.length; i++) {
		if (row===reservedArr[i][0] && seat===reservedArr[i][1]) {
			return true;
		}
	}
	return false;
}
$(document).ready(function() {
	$('.input-seats').val(0);
	$('.input-order-value').val(0);
	var index=0;
	var numberRow;
	var currentLocation;
	var currentLocationDiv;
	var currentLocationText;
	var currentСell;
	var id=url('?id');
	$.get( '../../get-all-shows.php', function( data ) {
		var answer1=JSON.parse(data);
		$('.title-spectacles').text('Бронування квитків - ' + '"' + answer1[id]['name'] + '"');
		$('.imgTipLeft').attr({'src': answer1[id]['img-src'],'alt': answer1[id]['name']});
		for (var i=0; i<config['number-rows']; i++) {
			var tr=$('<tr>').addClass('tr-rows');
			$('.table-container').append(tr);
			var td=$('<td>');
			td.addClass('td-number-rows');
			td.text('Ряд '+(i+1));
			tr.append(td);
			for (var j=0; j<config['number-seats']; j++) {
				var td=$('<td>');
				td.addClass('td-seats');
				if (checkReserved(i+1, j+1, answer1[id]['reserved'])) {
					td.addClass('reserved');
				}
				var input=$('<input type="hidden" class="input-hidden" name="" value="">');
				var divtext=$('<div>');
				td.append(divtext);
				td.append(input);
				divtext.text(j+1);
				tr.append(td);
			}
		}
		$('.td-seats:not(.reserved, .td-number-rows,)').click(function(){
			$('.bg-select').addClass('background-select');
			$('.select-choice').val('...');
			if (!($(this).hasClass('selected'))) {
				$('.input-seats').val(index+1);
				index+=1;
				}
			else {
			}
			$(this).addClass('selected');
			currentLocation=this;
			currentLocationDiv=($(this).children()[0]);
			currentLocationDivText=$(currentLocationDiv).text();
			currentLocationDivText=parseInt(currentLocationDivText,10);
			currentСell=$($(this).children()[1]);
			numberRow=$($(this).parent().children()[0]).text();
			numberRow=parseInt(numberRow.substr(4),10);
			$('.adult-children-block').removeClass('adult-children-none');
		});
		$('.select-choice').change(function(){
			var inputOrder=$('.input-order-value');
			var inputOrderVal = parseInt(inputOrder.val(), 10);
			inputOrderVal = inputOrderVal ? inputOrderVal : 0;
			var currentСellVal = parseInt(currentСell.val(), 10);
			currentСellVal = currentСellVal ? currentСellVal : 0;
			inputOrder.val(
			    inputOrderVal 
                + parseInt($(this).val(),10) 
                - currentСellVal
            );
			currentСell.val($(this).val());
			if ($(this).val()==="0") {
				$(currentLocation).removeClass('selected');
				$('.input-seats').val(index-1);
				index-=1;
			}
			$('.adult-children-block').addClass('adult-children-none');
		});
	});
	$('.input-order').click(function(event){
		if ($('.input-seats').val() !== '0') {
			$('.withdrawal-order-container-block').removeClass('withdrawal-order-container-none');
			$('.withdrawal-close').removeClass('withdrawal-close-none');
			var bookingNumber=Math.floor(Math.random()*90.999);
			bookingNumber=bookingNumber.toString();
			var d=new Date();
			var endingNumbers=d.getTime();
			endingNumbers=endingNumbers.toString();
			endingNumbers=endingNumbers.substr(8);
			$('.reservation-number').val(parseInt((bookingNumber+endingNumbers),10));
			$('.withdrawal-close').click(function(){
				$('.withdrawal-order-container-block').addClass('withdrawal-order-container-none');
				$('.withdrawal-close').addClass('withdrawal-close-none');
			});
		}
		else {
			event.preventDefault();
			window.alert("Оберіть місце та вид квитка");
		}
	});
	$( '.input-confirm-order' ).click(function( event ) {
		//debugger;
		if ($('.input-fio-text').val() !== "") {
			var formParameters = {
					'reservation-number':$('.reservation-number').val(),
					'input-fio-text':$('.input-fio-text').val(),
					'number-row':numberRow,
					'number-seat':currentLocationDivText,
					'textarea-comment-text':$('.textarea-comment-text').val()
				};
			$.post( '../../save-reservation.php', formParameters, function( data ) {
				
				var answer2=JSON.parse(data);
				$('.withdrawal-order-container-block').addClass('withdrawal-order-container-none');
				$('.message-server').text(answer2['1']['message']);
				$('.message-server-block').removeClass('message-server-none');
				$( '.input-ok' ).click(function( event ) {
					$('.message-server-block').addClass('message-server-none');
				});
			});
		}
		else {
			event.preventDefault();
			window.alert("Поле ПІБ обов'язкове до заповнення");
		}
	});
});

