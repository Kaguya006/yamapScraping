const puppeteer = require('puppeteer');

const scrape = async (pageUrl) => {
    if (process.argv.length < 4) {
	console.log("argument not enough.");
	return;
    }
    
    const wordList = [];
    for (let i = 3; i < process.argv.length; i++) {
	wordList.push(process.argv[i]);
    }
    
    const browser = await puppeteer.launch({args: ['--no-sandbox']});
    const page = await browser.newPage();
    await page.goto(pageUrl);
    const activityTags = await page.$$('a.ActivityItem__Thumbnail');
    const profileTags = await page.$$('a.ActivityItem__User');

    for (let i = 0; i < profileTags.length; i++) {
	const activityElement = activityTags[i];
	const profileElement = profileTags[i];
	const activityHref = await page.evaluate(e => e.href, activityElement);
	const profileHref = await page.evaluate(e => e.href, profileElement);
	const activityPage = await browser.newPage();
	const profilePage = await browser.newPage();
	await activityPage.goto(activityHref);
	await profilePage.goto(profileHref);

	const activityDiaryTags = await activityPage.$$('a.ActivityDetailTabLayout__TabItem');
	const activityDiaryElement = activityDiaryTags[1];
	const activityDiaryHref = await activityPage.evaluate(e => e.href, activityDiaryElement);
	const activityDiaryPage = await browser.newPage();
	await activityDiaryPage.goto(activityDiaryHref);

	//find the words you selected at wordList.
	const searchText = await activityDiaryPage.$$('p.LinkableText');
	let searchResult = [];
	for (let j = 0; j < searchText.length; j++) {
	    const t = (await((await searchText[j].getProperty('textContent')).jsonValue())).split(/\s+/);
	    for (let k = 0; k < wordList.length; k++) {
		const hitWords = t.filter(text => text.includes(wordList[k]))
		for (let l = 0; l < hitWords.length; l++) {
		    searchResult.push(hitWords[l]);
		}
	    }
	}

	//check user's profile.
	const userNameData = await profilePage.$x('//*[@id="overWriteCSS"]/article/header/section/div/div[1]/div/h2');
	const userName = await (await userNameData[0].getProperty('textContent')).jsonValue();
	const userProfile = await profilePage.$x('//*[@id="overWriteCSS"]/article/header/section/div/div[2]/div/ul/li');
	let profile = "";
	for (let j = 0; j < userProfile.length; j++) {
	    var t = await(await userProfile[j].getProperty('textContent')).jsonValue();
	    t = t.replace(/^\s+|\s+$/g, '');
	    if (j != userProfile.length - 1) profile = profile + t + ',';
	    else profile = profile + t;
	}


	console.log("[USER INFORMATION]");
	console.log(userName);
	console.log(profile);
	console.log('\n');
	console.log("[RESULT]", "(", activityPage.url(), ")");
	for (let p = 0; p < searchResult.length; p++) {
	    console.log(searchResult[p]);
	}
	console.log('\n\n\n');

	await activityDiaryPage.close();
	await profilePage.close();
    }
    
    await browser.close();
}

for (let i = 1; i <= 1; i++) {
    scrape(`https://yamap.com/search/activities?=&keyword=${process.argv[2]}&page=${i}`);
}
