(function ($, window) {

	$(function () {

		if (window.rl && window.rl && !window.rl.settingsGet('Auth'))
		{
			var
				sOccasionName = window.rl.pluginSettingsGet('count-down-the-days', 'occasion_name'),
				sOccasionDate = window.rl.pluginSettingsGet('count-down-the-days', 'occasion_date'),
				sOccasionLimit = window.rl.pluginSettingsGet('count-down-the-days', 'occasion_limit'),
				sOccasionBackground = window.rl.pluginSettingsGet('count-down-the-days', 'occasion_background'),
				sOccasionGranularity = window.rl.pluginSettingsGet('count-down-the-days', 'occasion_granularity'),
				ONEMINUTE = 60,
				ONEHOUR = ONEMINUTE * 60,
				ONEDAY = ONEHOUR * 24
			;

			function pluralizeMessage(count, singular, plural) {
				if (null == plural) {
					plural = singular + "s";
				}

				if (count == 1) {
					return " " + count + " " + singular;
				}
				else {
					return " " + count + " " + plural;
				}
			}
			function showTimeRemaining() {
				var dateParts = sOccasionDate.split("/");
				var countDownToMonth = dateParts[0];
				var countDownToDay = dateParts[1];
				var now = new Date();
				var year = now.getFullYear();

				// Figure out when the next occurance of our event will be -- either
				// this year, or next year, if this year's date has already gone by.
				// n.b. timeDifferenceInSeconds will be negative on the day of.
				var countdownDate = new Date(year, countDownToMonth - 1, countDownToDay, 0, 0, 0, 0);
				var timeDifferenceInSeconds = (countdownDate.getTime() - now.getTime()) / 1000;
				if (timeDifferenceInSeconds < -ONEDAY) {
					countdownDate = new Date(year + 1, countDownToMonth - 1, countDownToDay, 0, 0, 0, 0);
					timeDifferenceInSeconds = (countdownDate.getTime() - now.getTime()) / 1000;
				}

				// Calculate how many days, hours, minutes and seconds until our event.
				var daysToGo = Math.floor(timeDifferenceInSeconds / ONEDAY);
				var remainingTimeInSeconds = timeDifferenceInSeconds - (daysToGo * ONEDAY);

				var hoursToGo = Math.floor(remainingTimeInSeconds / ONEHOUR);
				remainingTimeInSeconds -= hoursToGo * ONEHOUR;

				var minutesToGo = Math.floor(remainingTimeInSeconds / ONEMINUTE);
				var secondsToGo = remainingTimeInSeconds - (minutesToGo * ONEMINUTE);

				// Composer our default messages
				var occasionMessage = " is in ";
				var daysToGoMsg = pluralizeMessage(daysToGo, "day");
				var hoursToGoMsg = pluralizeMessage(hoursToGo, "hour");
				var minutesToGoMsg = pluralizeMessage(minutesToGo, "minute");
				var secondsToGoMsg = pluralizeMessage(Math.floor(secondsToGo), "seconds");

				// Variable granularity: as the date approaches, show more precision.
				if ((sOccasionGranularity == "Days") && (timeDifferenceInSeconds < ONEDAY)) {
					sOccasionGranularity = "Hours";
				}
				if ((sOccasionGranularity == "Hours") && (timeDifferenceInSeconds < (3 * ONEHOUR))) {
					sOccasionGranularity = "Minutes";
				}
				if ((sOccasionGranularity == "Minutes") && (timeDifferenceInSeconds < (9 * ONEMINUTE))) {
					sOccasionGranularity = "Seconds";
					// We have to start calling this function more frequently
					setInterval(showTimeRemaining, 1000);
				}

				// Adjust the message parts based on the granularity
				switch (sOccasionGranularity) {
					case "Days":
					  if (hoursToGo + minutesToGo + secondsToGo > 0) {
						  daysToGo++;
							daysToGoMsg = pluralizeMessage(daysToGo, "day");
						}
						hoursToGoMsg = "";
						minutesToGoMsg = "";
						secondsToGoMsg = "";
						break;

					case "Hours":
						if (minutesToGo > 30) {
							hoursToGo++;
							hoursToGoMsg = pluralizeMessage(hoursToGo, "hour");
						}
						daysToGoMsg += " and ";
						minutesToGoMsg = "";
						secondsToGoMsg = "";
						break;

					case "Minutes":
					  if (secondsToGo > 30) {
					  	minutesToGo++;
					  	minutesToGoMsg = pluralizeMessage(minutesToGo, "minute");
					  }
						hoursToGoMsg += " and ";
						secondsToGoMsg = "";
						break;

					default:
						minutesToGoMsg += " and ";
						break;
				}

				// Get rid of the parts of the message we don't need any more,
				// as the date approaches.
				if (timeDifferenceInSeconds < ONEDAY) {
					daysToGoMsg = "";
				}
				if (timeDifferenceInSeconds < ONEHOUR) {
					hoursToGoMsg = "";
				}
				if (timeDifferenceInSeconds < ONEMINUTE) {
					minutesToGoMsg = "";
				}
				// Make a special message for today
				if (timeDifferenceInSeconds < 0) {
					occasionMessage = " IS TODAY!";
					secondsToGoMsg = "";
				}

				// If we are over our maximum number of days to
				// count down (e.g. if the date just passed by)
				// then hide the pane.
				if (daysToGo > sOccasionLimit) {
					$('#count-down-the-days-div').hide("slow");
				}
				else {
					// Otherwise, set the messages and show the pane.
					$('#occasion-name').text(sOccasionName);
					$('#occasion-message').text(occasionMessage);
					$('#occasion-days').text(daysToGoMsg);
					$('#occasion-hours').text(hoursToGoMsg);
					$('#occasion-minutes').text(minutesToGoMsg);
					$('#occasion-seconds').text(secondsToGoMsg);

					// Set the background image, if provided.
					if (sOccasionBackground) {
						$('#occasion').css('background-position', 'center');
						$('#occasion').css('background-size', '100%');
						$('#occasion').css('background-image', 'url(' + sOccasionBackground + ')');
					}

					$('#count-down-the-days-div').show("slow");
				}
			}

			if (sOccasionName && sOccasionDate) {

				// We will update our display once every minute (so that
				// hour displays will count down promptly), unless our
				// granularity is "seconds", in which case we'd better update
				// every second.
				var interval = 1000 * ONEMINUTE;
				if (sOccasionGranularity == "Seconds") {
					interval = 1000;
				}

				// Fire up our display and keep it updating.
				var oEl = $('#occasion');
				if (oEl) {
					setTimeout(showTimeRemaining, 100);
					setInterval(showTimeRemaining, interval);
				}
			}
		}

	});

}($, window));

