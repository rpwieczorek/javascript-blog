'use strict';
const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagInArticle: Handlebars.compile(document.querySelector('#template-tagInArticle-link').innerHTML),
  authorInArticle: Handlebars.compile(document.querySelector('#template-authorInArticle-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tagCloudLink').innerHTML),
  allAuthorsLinks: Handlebars.compile(document.querySelector('#template-allAuthorsLinks').innerHTML)
}


const opt = {
  articleSelector: '.post',
  titleSelector: '.post-title',
  titleListSelector: '.titles',
  articleTagsSelector: '.post-tags .list',
  articleAuthorSelector: '.post-author',
  listAuthorSelector: '.authors',
  cloudClassCount: '5',
  cloudClassPrefix: 'tag-size-',
};

function titleClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');
  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }
  /* [DONE] add class 'active' to the clicked link */
  clickedElement.classList.add('active');
  /* [DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts article.active');
  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }
  /* [DONE] get 'href' attribute from the clicked link */
  const targetArticle=clickedElement.getAttribute('href');
  /* [DONE] find the correct article using the selector (value of 'href' attribute) */
  const clickedArticle = document.querySelector('.posts ' + targetArticle);
  /* [DONE] add class 'active' to the correct article */
  clickedArticle.classList.add('active');
}

function generateTitleLinks(customSelector = ''){
  /* remove contents of titleList */
  const titleList = document.querySelector(opt.titleListSelector);
  titleList.innerHTML = '';
  /* for each article */
  const articles = document.querySelectorAll(opt.articleSelector + customSelector);
  let html ='';
  for(let article of articles){
//      console.log('jestem w tej petli x razy');
      /* get the article id */
      const articleId = article.getAttribute('id');
      /* find the title element */
      /* get the title from the title element */
      const articleTitle = article.querySelector(opt.titleSelector).innerHTML;
      //console.log(articleTitle);
      /* create HTML of the link */

      const linkHTMLData = {id: articleId, title: articleTitle};
      const linkHTML = templates.articleLink(linkHTMLData);
      //const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';

      /* insert link into titleList */
      html=html+linkHTML;
//      titleList.insertAdjacentHTML('beforeend',linkHTML);
  }
  titleList.innerHTML = html;
  const links = document.querySelectorAll('.titles a');
  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}

function calculateTagsParams(allTags){
  let min = Infinity;
  let max = 0;
  for (let tag in allTags){
    if (allTags[tag] < min){
      min = allTags[tag];
    }
    if (allTags[tag] > max){
      max = allTags[tag];
    }
  }
  return {min,max};
}

function calculateTagClass(count,params){
  const diffMaxMin = params['max']-params['min'];
  for (let size=0; size<=opt.cloudClassCount; size++){
    const rangeDown = params['min']+diffMaxMin/opt.cloudClassCount*size;
    const rangeUp = params['min']+diffMaxMin/opt.cloudClassCount*(size+1);
    if (count >= rangeDown  && count <= rangeUp) {
      return opt.cloudClassPrefix + (size+1);
    }
  }
}

function generateTags(){
  /* [NEW] create a new variable allTags with an empty array */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(opt.articleSelector);
  //console.log(articles);
  /* START LOOP: for every article: */
  for (let article of articles){
    /* find tags wrapper */
    let tagsList = article.querySelector(opt.articleTagsSelector);
    //console.log(tagsList);
    /* make html variable with empty string */
    let html='';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    /* split tags into array */
    const tagsArray = articleTags.split(' ');
    /* START LOOP: for each tag */
    for (let tag of tagsArray){
      /* generate HTML of the link */
      const linkHTMLData = {tag: tag};
      const linkHTML = templates.tagInArticle(linkHTMLData);
      /* add generated code to html variable */
      html=html + linkHTML;
      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags.hasOwnProperty(tag)){
        /* [NEW] add generated code to allTags array */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagsList.innerHTML = html;
  /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector('.tags');

  /* [NEW] create variable for all links HTML code */
  const tagsParams = calculateTagsParams(allTags);

  const allTagsData = {tags: []};
  /*  [NEW] START LOOP: for each tag in allTags: */
  for (let tag in allTags){
    /* [NEW] generate code of a link and add it to llTagsHTML */
    allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams)
    });
  }
  /* END LOOP: for each tag in all Tags */
  /* [NEW] add html form allTagsHTML to tagList */
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
  //console.log(allTagsData);
}

function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  //console.log(href);
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-','');
  /* find all tag links with class active */
  const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');
  /* START LOOP: for each active tag link */
  for (let activeTag of activeTags){
    /* remove class active */
    activeTag.classList.remove('active');
  /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const clickedTags = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  for (let clickedTag of clickedTags){
    /* add class active */
    clickedTag.classList.add('active');
      /* END LOOP: for each found tag link */
  }
  //console.log(clickedTags);
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* find all links to tags */
  const linksToTag = document.querySelectorAll('[href^="#tag-"]');
  //console.log(linksToTag);
  /* START LOOP: for each link */
  for (let link of linksToTag){
    link.addEventListener('click', tagClickHandler);
  }
  /* END LOOP: for each link */
}

function generateAuthors(){
  const articles = document.querySelectorAll(opt.articleSelector);
  let allAuthors = {};
  for(let article of articles){
    const articleAuthor = article.getAttribute('data-author');
    const authorWrapper = article.querySelector(opt.articleAuthorSelector);
    const linkHTMLData = { author: articleAuthor };
    const linkHTML = templates.authorInArticle(linkHTMLData);
    authorWrapper.innerHTML = linkHTML;
    if(!allAuthors.hasOwnProperty(articleAuthor)){
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }
  }
  const allAuthorsData = {authors:[]};
  for (let author in allAuthors){
    allAuthorsData.authors.push({
      author: author,
      count: allAuthors[author]
    })

  }
  const authorsList = document.querySelector(opt.listAuthorSelector);
  authorsList.innerHTML = templates.allAuthorsLinks(allAuthorsData);
}

function authorClickHandler(event) {
  //console.log('jestem w funkcji authorClickHandler');
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const author = href.replace('#author','');
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors() {
  const linksToAuthor = document.querySelectorAll('[href^="#author"]');
  //console.log(linksToAuthor);
  for (let link of linksToAuthor){
    link.addEventListener('click', authorClickHandler);
  }
}

function main(){
  generateTitleLinks();
  generateTags();
  addClickListenersToTags();
  generateAuthors();
  addClickListenersToAuthors();
}

main();
