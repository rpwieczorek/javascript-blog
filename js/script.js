'use strict';

const opt = {
  ArticleSelector: '.post',
  TitleSelector: '.post-title',
  TitleListSelector: '.titles',
  ArticleTagsSelector: '.post-tags .list',
  ArticleAuthorSelector: '.post-author',
  ListAuthorSelector: '.authors',
  CloudClassCount: '5',
  CloudClassPrefix: 'tag-size-',
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
  const titleList = document.querySelector(opt.TitleListSelector);
  titleList.innerHTML = '';
  /* for each article */
  const articles = document.querySelectorAll(opt.ArticleSelector + customSelector);
  let html ='';
  for(let article of articles){
//      console.log('jestem w tej petli x razy');
      /* get the article id */
      const articleId = article.getAttribute('id');
      /* find the title element */
      /* get the title from the title element */
      const articleTitle = article.querySelector(opt.TitleSelector).innerHTML;
      //console.log(articleTitle);
      /* create HTML of the link */
      const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
//      console.log(linkHTML);
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
  for (let size=0; size<=opt.CloudClassCount; size++){
    const rangeDown = params['min']+diffMaxMin/opt.CloudClassCount*size;
    const rangeUp = params['min']+diffMaxMin/opt.CloudClassCount*(size+1);
    if (count >= rangeDown  && count <= rangeUp) {
      return opt.CloudClassPrefix + (size+1);
    }
  }
}

function generateTags(){
  /* [NEW] create a new variable allTags with an empty array */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(opt.ArticleSelector);
  //console.log(articles);
  /* START LOOP: for every article: */
  for (let article of articles){
    /* find tags wrapper */
    let tagsList = article.querySelector(opt.ArticleTagsSelector);
    //console.log(tagsList);
    /* make html variable with empty string */
    let html='';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    /* split tags into array */
    const tagsArray = articleTags.split(' ');
    //console.log(tags);
    /* START LOOP: for each tag */
    for (let tag of tagsArray){
      /* generate HTML of the link */
      const linkHTML = '<li><a href="#tag-' + tag + '">' + tag +  '&nbsp</a></li>';
      //console.log(linkHTML);
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

  let allTagsHTML = '';
  /*  [NEW] START LOOP: for each tag in allTags: */
  for (let tag in allTags){
    /* [NEW] generate code of a link and add it to llTagsHTML */
    allTagsHTML += '<li><a href="#tag-' + tag + '"class="' + calculateTagClass(allTags[tag],tagsParams) +'">&nbsp' + tag + ' </a></li>' ;
  }
  /* END LOOP: for each tag in all Tags */
  /* [NEW] add html form allTagsHTML to tagList */
  tagList.innerHTML = allTagsHTML;
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
  const articles = document.querySelectorAll(opt.ArticleSelector);
  let allAuthors = {};
  for(let article of articles){
    const articleAuthor = article.getAttribute('data-author');
    const authorWrapper = article.querySelector(opt.ArticleAuthorSelector);
    authorWrapper.innerHTML = 'by&nbsp<a href="#author' + articleAuthor + '">' + articleAuthor + '</a>';
    if(!allAuthors.hasOwnProperty(articleAuthor)){
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }
  }
  let allAuthorsHTML = '';
  for (let author in allAuthors){
    allAuthorsHTML += '<li><a href="#author' + author +'">' + author + ' (' + allAuthors[author] + ') </a></li>' ;
  }
  const authorsList = document.querySelector(opt.ListAuthorSelector);
  authorsList.innerHTML = allAuthorsHTML;
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
