import './clean-repo-sidebar.css';
import {elementExists} from 'select-dom';
import {$, $optional} from 'select-dom/strict.js';
import domLoaded from 'dom-loaded';
import elementReady from 'element-ready';
import * as pageDetect from 'github-url-detection';

import features from '../feature-manager.js';
// The h2 is to avoid hiding website links that include '/releases' #4424
// TODO: It's broken
const releasesSidebarSelector = '.Layout-sidebar .BorderGrid-cell h2 a[href$="/releases"]';
async function cleanReleases(): Promise<void> {
	const sidebarReleases = await elementReady(releasesSidebarSelector, {waitForChildren: false});
	if (!sidebarReleases) {
		return;
	}

	const releasesSection = sidebarReleases.closest('.BorderGrid-cell')!;
	if (!elementExists('.octicon-tag', releasesSection)) {
		// Hide the whole section if there's no releases
		releasesSection.hidden = true;
		return;
	}

	// Collapse "Releases" section into previous section
	releasesSection.classList.add('border-0', 'pt-md-0');
	sidebarReleases.closest('.BorderGrid-row')!
		.previousElementSibling! // About’s .BorderGrid-row
		.firstElementChild! // About’s .BorderGrid-cell
		.classList
		.add('border-0', 'pb-0');
}

async function hideLanguageHeader(): Promise<void> {
	await domLoaded;

	const lastSidebarHeader = $optional('.Layout-sidebar .BorderGrid-row:last-of-type h2');
	if (lastSidebarHeader?.textContent === 'Languages') {
		lastSidebarHeader.hidden = true;
	}
}

// Hide empty meta if it’s not editable by the current user
async function hideEmptyMeta(): Promise<void> {
	await domLoaded;

	if (!pageDetect.canUserEditRepo()) {
		$optional('.Layout-sidebar .BorderGrid-cell > .text-italic')?.remove();
	}
}

async function moveReportLink(): Promise<void> {
	await domLoaded;

	const reportLink = $optional('.Layout-sidebar a[href^="/contact/report-content"]')?.parentElement;
	if (reportLink) {
		// Your own repos don't include this link
		$('.Layout-sidebar .BorderGrid-row:last-of-type .BorderGrid-cell').append(reportLink);
	}
}

async function init(): Promise<void> {
	document.documentElement.setAttribute('rgh-clean-repo-sidebar', '');
}

void features.add(import.meta.url, {
	include: [
		pageDetect.isRepoRoot,
	],
	deduplicate: 'has-rgh-inner',
	init: [
		init,
		cleanReleases,
		hideLanguageHeader,
		hideEmptyMeta,
		moveReportLink,
	],
});

/*

Test URLs:

- https://github.com/refined-github/refined-github
- Repo with empty packages section: https://github.com/isaacs/node-glob
- Repo with 1 package: https://github.com/recyclarr/recyclarr

*/
