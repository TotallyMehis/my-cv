'use strict';

$(document).ready(function() {
	const highlightColor = '#dddddd';


	//
	// Some old WIP stuff.
	//

	// const registerBtn = (btnName, sectionName) => {
	// 	//let tap = ('ontouchstart' in document.documentElement);
	// 	//if (tap)
	// 	//	return;
		
		
	// 	$(btnName).mouseenter(function() {
	// 		$(sectionName).css('background-color', highlightColor);
	// 	});
	// 	$(btnName).mouseleave(function() {
	// 		$(sectionName).css('background-color', '#ffffff');
	// 	});
	// }
	//registerBtn('#link-me', '.section.me');
	//registerBtn('#link-stuff', '.section.stuff');
	//registerBtn('#link-skills', '.section.skills');



	//
	//  When clicked on a project reference, highlight said project.
	//

	// Find all the possible projects and register the highlight.
	$('[id^=project-]').each(function() {
		const myId = $(this).attr('id');
		const id = myId.replace(/project-/, '');


		const hrefTarget = '#'+myId;
		const sectionName = '#section-project-'+id;

		console.log("Href Target: "+hrefTarget+" | Project section: "+sectionName);

		// For all the reference links:
		$('td.skill-name .ref').each(function() {
			if ($(this).attr('href') !== hrefTarget) {
				return;
			}
	

			$(this).click(function() {
				$(sectionName).css('background-color', highlightColor);
				setTimeout(function() {
					$(sectionName).css('background-color', '#ffffff');
				}, 1000);
			});
		});
	});
	

	//
	// Nav bar that follows you
	//
	let navbar = $('#nav-bar');

	// Add a bit in case something goes wrong
	const stickyPos = $('#section-me').offset().top - navbar.height() - 1;

	$(window).scroll(function() {
		if (window.pageYOffset >= stickyPos)
		{
			navbar.addClass('sticky');
			navbar.removeClass('position-absolute');
		}
		else
		{
			navbar.addClass('position-absolute');
			navbar.removeClass('sticky');
		}
	});

	// Make sure the bar appears on refresh.
	$(window).scroll();
});

