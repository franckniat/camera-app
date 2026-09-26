import type { Locale } from "./config";

import type { Plural } from "./format";

const en = {
	meta: {
		title: "Web camera app",
		description:
			"A simple web camera app that allows you to take pictures and record videos.",
	},
	home: {
		titleBefore: "Welcome to the",
		titleHighlight: "web camera",
		titleAfter: "app",
		description:
			"Take pictures and record videos right from your browser. Everything stays on your device.",
		getStarted: "Get started",
		contribute: "Contribute",
		credits: "Coded with ❤️ by Franck NIAT",
	},
	nav: {
		back: "Home",
		photo: "Photo",
		video: "Video",
		modes: "Capture mode",
	},
	settings: {
		theme: "Toggle theme",
		language: "Français",
		languageShort: "FR",
	},
	camera: {
		loading: "Starting camera…",
		retry: "Try again",
		errors: {
			notAllowed: {
				title: "Camera access denied",
				description:
					"Allow camera access in your browser's site settings, then try again.",
			},
			notFound: {
				title: "No camera found",
				description: "Connect a camera to your device, then try again.",
			},
			notReadable: {
				title: "Camera unavailable",
				description:
					"Your camera is being used by another application. Close it, then try again.",
			},
			insecure: {
				title: "Secure connection required",
				description:
					"Browsers only allow camera access over HTTPS or on localhost.",
			},
			generic: {
				title: "Could not start the camera",
				description: "Something went wrong while opening your camera.",
			},
		},
		switchCamera: "Switch camera",
		mirror: "Mirror preview",
		timer: "Self-timer",
		timerOff: "Self-timer: off",
		timerValue: "Self-timer: {seconds} s",
		micOn: "Record sound",
		micOff: "Sound muted",
		takePhoto: "Take a picture",
		shortcut: "Press Space",
		photoCaptured: "Picture saved",
		captureFailed: "Could not take the picture",
		startRecording: "Start recording",
		stopRecording: "Stop recording",
		recording: "Recording",
		videoSaved: "Video saved",
		recordingFailed: "Recording failed",
		recordingUnsupported: "Video recording is not supported by this browser",
	},
	gallery: {
		openPhotos: "Open photo gallery",
		openVideos: "Open video gallery",
		photosTitle: "Photos",
		videosTitle: "Videos",
		photoCount: { one: "{count} photo", other: "{count} photos" } as Plural,
		videoCount: { one: "{count} video", other: "{count} videos" } as Plural,
		empty: "Nothing here yet.",
		open: "Open",
		download: "Download",
		delete: "Delete",
		downloadAll: "Download all",
		deleteAll: "Delete all",
		confirmTitle: "Delete everything?",
		confirmPhotos: "All {count} photos will be permanently deleted from this device.",
		confirmVideos: "All {count} videos will be permanently deleted from this device.",
		cancel: "Cancel",
		confirm: "Delete all",
		previous: "Previous",
		close: "Close",
		next: "Next",
		deleted: "Deleted",
		allDeleted: "Gallery cleared",
		preparingZip: "Preparing archive…",
		zipFailed: "Could not create the archive",
		position: "{index} of {total}",
	},
	storage: {
		quotaExceeded:
			"Your device storage is full. Delete some items from the gallery and try again.",
		saveFailed: "Could not save to the gallery",
		loadFailed: "Could not load the gallery",
	},
	notFound: {
		title: "Page not found",
		back: "Back to home",
	},
};

export type Dictionary = typeof en;

const fr: Dictionary = {
	meta: {
		title: "Application caméra web",
		description:
			"Une application caméra web simple pour prendre des photos et enregistrer des vidéos.",
	},
	home: {
		titleBefore: "Bienvenue sur l'application",
		titleHighlight: "caméra web",
		titleAfter: "",
		description:
			"Prenez des photos et enregistrez des vidéos directement depuis votre navigateur. Tout reste sur votre appareil.",
		getStarted: "Commencer",
		contribute: "Contribuer",
		credits: "Codé avec ❤️ par Franck NIAT",
	},
	nav: {
		back: "Accueil",
		photo: "Photo",
		video: "Vidéo",
		modes: "Mode de capture",
	},
	settings: {
		theme: "Changer de thème",
		language: "English",
		languageShort: "EN",
	},
	camera: {
		loading: "Démarrage de la caméra…",
		retry: "Réessayer",
		errors: {
			notAllowed: {
				title: "Accès à la caméra refusé",
				description:
					"Autorisez l'accès à la caméra dans les paramètres du site de votre navigateur, puis réessayez.",
			},
			notFound: {
				title: "Aucune caméra détectée",
				description: "Branchez une caméra à votre appareil, puis réessayez.",
			},
			notReadable: {
				title: "Caméra indisponible",
				description:
					"Votre caméra est utilisée par une autre application. Fermez-la, puis réessayez.",
			},
			insecure: {
				title: "Connexion sécurisée requise",
				description:
					"Les navigateurs n'autorisent l'accès à la caméra qu'en HTTPS ou sur localhost.",
			},
			generic: {
				title: "Impossible de démarrer la caméra",
				description: "Une erreur est survenue à l'ouverture de la caméra.",
			},
		},
		switchCamera: "Changer de caméra",
		mirror: "Effet miroir",
		timer: "Retardateur",
		timerOff: "Retardateur : désactivé",
		timerValue: "Retardateur : {seconds} s",
		micOn: "Enregistrer le son",
		micOff: "Son coupé",
		takePhoto: "Prendre une photo",
		shortcut: "Appuyez sur Espace",
		photoCaptured: "Photo enregistrée",
		captureFailed: "Impossible de prendre la photo",
		startRecording: "Démarrer l'enregistrement",
		stopRecording: "Arrêter l'enregistrement",
		recording: "Enregistrement",
		videoSaved: "Vidéo enregistrée",
		recordingFailed: "L'enregistrement a échoué",
		recordingUnsupported:
			"L'enregistrement vidéo n'est pas pris en charge par ce navigateur",
	},
	gallery: {
		openPhotos: "Ouvrir la galerie photo",
		openVideos: "Ouvrir la galerie vidéo",
		photosTitle: "Photos",
		videosTitle: "Vidéos",
		photoCount: { one: "{count} photo", other: "{count} photos" },
		videoCount: { one: "{count} vidéo", other: "{count} vidéos" },
		empty: "Rien pour l'instant.",
		open: "Ouvrir",
		download: "Télécharger",
		delete: "Supprimer",
		downloadAll: "Tout télécharger",
		deleteAll: "Tout supprimer",
		confirmTitle: "Tout supprimer ?",
		confirmPhotos:
			"Les {count} photos seront définitivement supprimées de cet appareil.",
		confirmVideos:
			"Les {count} vidéos seront définitivement supprimées de cet appareil.",
		cancel: "Annuler",
		confirm: "Tout supprimer",
		previous: "Précédent",
		close: "Fermer",
		next: "Suivant",
		deleted: "Supprimé",
		allDeleted: "Galerie vidée",
		preparingZip: "Préparation de l'archive…",
		zipFailed: "Impossible de créer l'archive",
		position: "{index} sur {total}",
	},
	storage: {
		quotaExceeded:
			"L'espace de stockage de votre appareil est plein. Supprimez des éléments de la galerie et réessayez.",
		saveFailed: "Impossible d'enregistrer dans la galerie",
		loadFailed: "Impossible de charger la galerie",
	},
	notFound: {
		title: "Page introuvable",
		back: "Retour à l'accueil",
	},
};

const dictionaries: Record<Locale, Dictionary> = { en, fr };

export function getDictionary(lang: Locale): Dictionary {
	return dictionaries[lang];
}
