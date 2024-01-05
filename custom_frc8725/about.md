<!-- don'tParseAsArticle -->
<style>
	/* basic */
	#aboutContent * {
		margin: 0px;
		outline: none;
		box-sizing: border-box;
		font-family: Arial, Helvetica, sans-serif;
		user-select: none;
	}

	#aboutContent, #glassBox {
		margin: 0px !important;
		width: calc(100*var(--mw)) !important;
    	height: calc(100*var(--mh)) !important;
		position: relative;
	}

	/* settings class */
	#aboutContent [display="bothCenter"] {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: center;
		align-items: center;
	}
	#aboutContent [material="glass"] {
		background-color: #ffffff30;
		backdrop-filter: blur(calc(0.4*var(--mw)));
		border-color: #aaaaaa00;
		border-width: 2px;
		border-style: solid;
		border-radius: 20px;
	}

	/* type class */
	#aboutContent .page {
		--margin: calc(4*var(--mw));
		margin: var(--margin) var(--margin) calc(var(--margin)*2) var(--margin);
		width: calc(100*var(--mw) - var(--margin)*2);
		height: calc(100*var(--mh) - var(--margin)*2);
		--pageInnerWidth: 100%;
		--pageInnerHeight: 100%;
	}

	#aboutContent .containBox{
		padding: calc(4*var(--mw));
		width: 100%;
		height: 100%;
		box-sizing: border-box;
	}
	#aboutContent .cardBox {
		display: flex;
		flex-direction: row;
		align-content: center;
		justify-content: flex-start;
		flex-wrap: wrap;
		align-items: center;
		gap: calc(4*var(--mw));
		width: var(--pageInnerWidth);
		height: calc(var(--pageInnerHeight)*0.6);
	}
	#aboutContent .cardBox > .card {
		--bgi: url('');
		--shadowColor: black;
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		align-content: center;
		justify-content: center;
		align-items: center;
		height: calc(var(--pageInnerHeight)*0.45);
		width: calc(19.8*var(--mw));
		position: relative;
		background: white;
		border-color: transparent;
		border-color: #afafaf88;
		border-width: 2px;
		border-style: solid;
		border-radius: 15px;
		box-shadow: 0px 0px 0px calc(-1*var(--mw)) white;
		transform: translateY(0px);
		transition: 0.5s;
		transition-timing-function: cubic-bezier(0.6, -0.57, 0.26, 2.12);
		overflow: hidden;
	}
	/* #aboutContent .cardBox > .card:hover {
		border-color: #afafaf88;
		border-color: var(--shadowColor);
		box-shadow: calc(2*var(--mw)) calc(2*var(--mw)) calc(1*var(--mw)) 0px #00000088;
		transform: translateY(-10px);
		box-shadow: 0px 20px 5px 0px var(--shadowColor);
	} */

	#aboutContent .cardBox > .card:hover {
		animation: sh0 0.5s ease-in-out both;
		border-color: var(--shadowColor);
		transform: translateY(-10px);
	}

	@keyframes sh0 {
	0% {
		transform: rotate(0deg);
	}

	25% {
		transform: rotate(7deg);
	}

	50% {
		transform: rotate(-7deg);
	}

	75% {
		transform: rotate(1deg);
	}

	100% {
		transform: rotate(0deg);
	}
	}

	#aboutContent .cardBox > .card:hover span {
		animation: storm 0.7s ease-in-out both;
		animation-delay: 0.06s;
	}

	#aboutContent .cardBox > .card::before {
		content: "";
		position: absolute;
		--width: calc(12*var(--mw));
		width: var(--width);
		height: var(--width);
		bottom: calc(var(--width)*-0.25);
		right: calc(var(--width)*-0.25);
		z-index: -1;
		background-image: var(--bgi);
		background-position: 0px 0px;
		background-repeat: no-repeat;
		background-size: 100%;
		transform: rotateZ(30deg) translateY(0px);
		filter: grayscale(10);
		opacity: 0.2;
		transition: 1s;
	}
	#aboutContent .cardBox > .card:hover::before {
		bottom: 50%;
		right: calc((100% - var(--width) - 4px)/2);
		transform: rotateZ(0deg) translateY(50%);
		filter: grayscale(0);
	}
	#aboutContent .cardBox > .card > h3 {
		margin: calc(1*var(--mh)) calc(2*var(--mw));
		color: black;
		text-align: center;
		font-size: calc(1.8*var(--mw));
		font-weight: bold;
	}
	#aboutContent .cardBox > .card > p {
		margin: calc(0.5*var(--mh)) calc(2*var(--mw));
		color: black;
		text-align: center;
		font-size: calc(1.2*var(--mw));
		font-weight: bold;
	}

	/* unique element */
	#aboutContent #waterDropCvs {
		position: fixed;
		top: 0px;
		left: 0px;
		z-index: 1;
	}

	#aboutContent #pageBox {
		--pageIndex: 0;
		width: 100%;
		height: 100%;
		top: calc(-100*var(--mh) * var(--pageIndex));
		left: 0px;
		transition: 0.5s;
		z-index: 2;
	}

	#aboutContent #title {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-content: center;
		justify-content: center;
		align-items: center;
		width: var(--pageInnerWidth);
		height: calc(var(--pageInnerHeight)*0.1);
		color: var(--text-color1);
		text-shadow: calc(1*var(--mw)) calc(1*var(--mw)) calc(1*var(--mw)) #00000058;
		font-size: calc(5*var(--mw));
		font-family: 'Courier New', Courier, monospace;
		text-align: center;
	}

	@media screen and (max-width: 100vh) {
		#aboutContent, 
		#aboutContent #glassBox, 
		#aboutContent .containBox, 
		#aboutContent .cardBox {
			height: auto !important;
		}

		#aboutContent .cardBox {
			display: flex;
			flex-direction: column;
			flex-wrap: nowrap;
			align-content: center;
			align-items: center;
			margin: calc(1*var(--mw)) 0px;
			height: calc(var(--pageInnerHeight)*0.8);
		}
		#aboutContent .cardBox > .card {
			flex-direction: row-reverse;
			justify-content: center;
			align-items: center;
			align-content: center;
			flex-wrap: nowrap;
			width: 100%;
			height: calc(20*var(--mw));
		}
		#aboutContent .cardBox > .card::before {
			--width: calc(15*var(--mh));
		}
		#aboutContent .cardBox > .card > h3 {
			margin: 0px calc(4*var(--mw)) 0px calc(2*var(--mw));
			width: 30%;
			font-size: calc(6.2*var(--mw));
		}
		#aboutContent .cardBox > .card > p {
			margin: 0px calc(2*var(--mw)) 0px calc(4*var(--mw));
			width: 70%;
			font-size: calc(4.2*var(--mw));
		}

		#aboutContent #title {
			height: calc(var(--pageInnerHeight)*0.2);
		}

	}
	@media screen and (min-width: 200vh) and (max-width: 300vh) {
		#aboutContent #title {
			width: calc(100% - 4*var(--mw)*2);
			position: absolute;
			top: 0px;
			transform: translateY(-50%);
		}
		#aboutContent .cardBox{
			--gapX: 2%;
			--gapY: 10%;
			gap: var(--gapY) var(--gapX);
			width: calc((100% - 4*var(--mw)*3)*1.15);
			height: calc((100% - 4*var(--mw)*2)*1.2);
			/* position: absolute; */
			bottom: calc(4*var(--mw));
			right: calc(4*var(--mw));
			box-sizing: border-box;
			transform: translateY(7%);
		}
		#aboutContent .cardBox > .card {
			width: calc((100% - var(--gapX)*3)/4);
			height: calc((100% - var(--gapY)*1)/2);
		}
		#aboutContent .cardBox > .card > p {
			font-size: calc(1.2*var(--mw));
		}
	}
	@media screen and (min-width: 300vh) {
		#aboutContent #title {
			width: calc(100% - 4*var(--mw)*2);
			position: absolute;
			top: 0px;
			transform: translateY(-50%);
		}
		#aboutContent .cardBox{
			--gapX: 2%;
			--gapY: 10%;
			gap: var(--gapY) var(--gapX);
			width: calc(100% - 4*var(--mw)*2);
			height: calc((100% - 4*var(--mw)*2)*0.9);
			position: absolute;
			bottom: calc(4*var(--mw));
			right: calc(4*var(--mw));
			box-sizing: border-box;
		}
		#aboutContent .cardBox > .card {
			width: calc((100% - var(--gapX)*3)/4);
			height: calc((100% - var(--gapY)*1)/2);
		}
		#aboutContent .cardBox > .card > p {
			display: none;
		}
	}
</style>
<div id="aboutContent">
	<div id="glassBox" class="page" display="bothCenter" material="glass">
		<div class="containBox">
			<h1 id="title">About Misty Panther</h1>
			<div class="cardBox" display="bothCenter">
				<a target="_blank" class="card hrefButton" style="--shadowColor: #ff7e7e; --bgi: url('<?=basicPath?>/image/aboutImage/logo-youtube.png');" href="https://www.youtube.com/@frc8725">
					<h3>YouTube</h3>
					<p contentkey="youtube-description">Misty Panther<br>Youtube 頻道</p>
				</a>
				<a target="_blank" class="card hrefButton" style="--shadowColor: #666666; --bgi: url('<?=basicPath?>/image/aboutImage/logo-github.png');" href="https://github.com/FRC8725">
					<h3>Github</h3>
					<p contentkey="github-description">Robot Programming</p>
				</a>
				<a target="_blank" class="card hrefButton" style="--shadowColor: #ff7343; --bgi: url('<?=basicPath?>/image/aboutImage/logo-instagram.png');" href="https://www.instagram.com/frc_8725/">
					<h3>Instagram</h3>
					<p contentkey="instagram-description">隊伍日常<br>交流、活動、培訓</p>
				</a>
				<a target="_blank" class="card hrefButton" style="--shadowColor: #666666; --bgi: url('<?=basicPath?>/image/aboutImage/logo-twitter.png');" href="https://www.youtube.com/watch?v=BbeeuzU5Qc8">
					<h3>Twitter</h3>
					<p contentkey="twitter-description">...</p>
				</a>
				<a target="_blank" class="card hrefButton" style="--shadowColor: #9bffa0; --bgi: url('<?=basicPath?>/image/aboutImage/logo-spotify.png');" href="https://www.youtube.com/watch?v=BbeeuzU5Qc8">
					<h3>Spotify</h3>
					<p contentkey="spotify-description">...</p>
				</a>
				<a target="_blank" class="card hrefButton" style="--shadowColor: #ac5d1e; --bgi: url('<?=basicPath?>/image/aboutImage/logo-frc8725.png');" href="https://frc8725misty.blogspot.com/">
					<h3>FRC-8725</h3>
					<p contentkey="github-description">南山高中 FRC Team <br>8725 Misty Panther</p>
				</a>
				<a target="_blank" class="card hrefButton" style="--shadowColor: #fff27a; --bgi: url('<?=basicPath?>/image/aboutImage/logo-photos.png');" href="https://photos.google.com/?album=alanwu" onclick="event.preventDefault();window.open('https:\/\/youtu.be/dQw4w9WgXcQ?si=aiFtJ-IFWJuDlxDU', '_blank');">
					<h3>Photos</h3>
					<p contentkey="twitch-description">...<br></p>
				</a>
			</div>
		</div>
	</div>
</div>