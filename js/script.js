'use strict';

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

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthor = '.post-author';

function generateTitleLinks(customSelector = ''){

  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';

  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  let html ='';
  for(let article of articles){
//      console.log('jestem w tej petli x razy');
      /* get the article id */
      const articleId = article.getAttribute('id');
      /* find the title element */
      /* get the title from the title element */
      const articleTitle = article.querySelector(optTitleSelector).innerHTML;
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

generateTitleLinks();


function generateTags(){
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  //console.log(articles);

  /* START LOOP: for every article: */
  for (let article of articles){
    /* find tags wrapper */
    let tagsList = article.querySelector(optArticleTagsSelector);
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
      //console.log(html);
    /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagsList.innerHTML = html;
    //console.log(tagsList);
  /* END LOOP: for every article: */
  }
}

generateTags();

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
addClickListenersToTags();

function generateAuthors(){
  const articles = document.querySelectorAll(optArticleSelector);
  for(let article of articles){
    const articleAuthor = article.getAttribute('data-author');
    //console.log(articleAuthor);
    const authorWrapper = article.querySelector(optArticleAuthor);
    authorWrapper.innerHTML = 'by&nbsp<a href="#' + articleAuthor + '">' + articleAuthor + '</a>';
  }
}
generateAuthors();
