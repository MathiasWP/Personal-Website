import activateScrollbar from '../dist/activateScrollbar.js';

/**
 * Function for creating the the blog and adding to DOM
 * @param {array} blogPost - Array with the elements of blog-post
 */

function showCurrentBlogPost(blogPost) {
  const blogDocument = document.querySelector('.blog-doc');
  const scrollWrapper = document.querySelector('.scroll');

  // Hiding text quick
  blogDocument.classList.add('hide');
  scrollWrapper.classList.remove('scroll-active');

  // Resetting blog-documents content
  blogDocument.innerHTML = '';

  /**
   * Function for creating the correct elements in document
   * @param {array} part - Tells what kind of element to be created
   * @param {HTMLElement} parent - Tells us where to add the element
   */

  function creatingCorrectElement(part, parent) {
    // Creating title element
    if (part[0] === 'title') {
      const title = document.createElement('h2');
      title.textContent = part[1];
      title.classList.add('blog-doc-title');
      document.title = part[1];
      parent.appendChild(title);
    }

    // Creating timestamp element
    if (part[0] === 'timestamp') {
      const title = document.createElement('p');
      title.textContent = part[1];
      title.classList.add('blog-doc-timestamp');
      parent.appendChild(title);
    }

    // Creating introduction element
    if (part[0] === 'introduction') {
      const introduction = document.createElement('section');
      introduction.textContent = part[1];
      introduction.classList.add('blog-doc-introduction');
      parent.appendChild(introduction);
    }

    // Creating title element
    if (part[0] === 'undertitle' || part.undertitle) {
      const undertitle = document.createElement('h3');
      undertitle.textContent = part[1] || part.undertitle;
      undertitle.classList.add('blog-doc-undertitle');
      parent.appendChild(undertitle);
    }

    // Creating code element
    if (part[0] === 'code' || part.code) {
      const code = document.createElement('code');
      code.textContent = part[1] || part.code;
      code.classList.add('blog-doc-code');
      parent.appendChild(code);
    }

    // Creating text element, this one is a stupid one because of TAGS (they identify as text and can also be in the middle of text)
    if (part[0] === 'text' || part.text) {
      let text = part[1] || part.text;
      text = text.split(' ');

      const textFlag = {
        inParenthesis: false
      };

      // Don't really like how text is added (word by word), but i'll figure out something here. Maybe i'll just let it be that way and keep it "unique".
      // Looping through all full words in text
      for (let i = 0; i < text.length; i++) {
        // If not tag element, then it's just normal text
        if (!text[i].startsWith('--tag')) {
          // If we find a opening-parenthesis we are in PARENTHESIS-MODE!
          if (text[i].startsWith('(')) {
            textFlag.inParenthesis = true;
          }

          // If we find a closing-parenthesis we are NOT in PARENTHESIS-MODE!
          if (text[i].endsWith(')')) {
            textFlag.inParenthesis = false;
          }

          // Insert into blog-doc
          parent.insertAdjacentText('beforeend', `${text[i]} `);
        } else {
          // If tag element... HERE WE GO
          // My little tag-parser. Not the best, but it works
          let tagArray = text[i].split('--tag');

          i++;

          // Have to keep looking through the text array in case for example text= has more words with spaces between them (because then it got picked up by the split(" "))
          // Also checking that we are not at the last spot in the text
          if (i !== text.length) {
            // If we are not, remove i++
            i--;
            // Keep looking through text array until we find the ending parenthesis for tag element
            while (!text[i].endsWith(')')) {
              i++;
              tagArray.push(text[i]);
            }
          }

          // Creating a string of the content in --tag
          let tagString = tagArray.join(' ').trim();

          let overflow = [];

          // If we are inside a parenthesis, we have to do some extra work because the while-loop fucked us over
          if (textFlag.inParenthesis) {
            let i = tagString.length - 1;

            // Split up tagString so it becomes an array
            tagString = tagString.split('');

            // We go backwards as long as symbol not matches a letter
            while (!tagString[i].match(/^[A-Za-z]+$/)) {
              // We add the overflow symbols to overflow array
              overflow.push(tagString.pop());
              i--;
            }

            // We remove the last overflow, as this is the actual parenthesis we want
            tagString.push(overflow.pop());

            // Turn into a string
            tagString = tagString.join('');

            // Reverse overflow because we went backwards and also make it into a string
            overflow = overflow.reverse().join('');

            // No longer inParenthesis baby
            textFlag.inParenthesis = false;
          }

          // Getting the tag
          let TAG = tagString.split(',')[0].substring(1);

          // Create correct element
          const element = document.createElement(`${TAG}`);

          // List with attributes of element
          const attributeList = [];

          for (let i = 0; i < tagString.length; i++) {
            // If we find a '=', we need too check if what was before was an actual attribute
            if (tagString[i] === '=') {
              let attribute = '';

              let j = i - 1;

              // We go backwards and check every letter until we meet a ',' (because this is the symbol that should be before every attribute)
              while (tagString[j] !== ',') {
                attribute += tagString[j];
                j--;
              }

              // Need to reverse attribute
              attribute = attribute
                .split('')
                .reverse()
                .join('');

              // If attribute parsed is in current element go into "inAttribute" mode
              if (attribute in element) {
                attributeList.push(attribute);
              }
              // Fix for allowing only the usage of 'text' in my blog-writing (automatically turning them into textContents)
              else if (attribute === 'text') {
                attribute = 'textContent';
                attributeList.push(attribute);
              }
            }
          }

          // Let's store the values of the attributes
          let attributeValues = [];

          // Loop through all attributes found
          for (let i = 0; i < attributeList.length; i++) {
            // Setting it currently back to the same as it is in blog-text, easy fix for parsing
            let thisAttribute =
              attributeList[i] === 'textContent' ? 'text' : attributeList[i];

            // We find the index of the attribute in the whole tagString, and add the length of the attribute + 1 (because of the =)
            const startIndex =
              tagString.indexOf(thisAttribute) + thisAttribute.length + 1;

            let endIndex;

            // Here we find the end-index. It's either the start of the next attribute or end of tagString (if last attribute
            if (i !== attributeList.length - 1) {
              let nextAttribute = attributeList[i + 1];

              if (nextAttribute === 'textContent') {
                nextAttribute = 'text';
              }

              endIndex = tagString.indexOf(nextAttribute) - 1;
            } else {
              endIndex = -1;
            }

            // Slice slice baby, give me the attribute from the start to the end
            let foundValue = tagString.slice(startIndex, endIndex);

            // We don't want any commas
            if (foundValue.endsWith(',')) {
              foundValue = foundValue.slice(0, -1);
            }

            // Add value to attributeValue list
            attributeValues.push(foundValue);
          }

          // Set the attributes and their values to the element
          for (let i = 0; i < attributeList.length; i++) {
            element[attributeList[i]] = attributeValues[i];
          }

          // If tag is a link element, automatically add target='_blank' with safety goggles on
          if (TAG.toLowerCase() === 'a') {
            element.target = '_blank';
            element.rel = 'noopener';
          }

          // Insert tag-element into blog-text
          parent.insertAdjacentElement('beforeend', element);

          // If there was any overflow, add that, else add the space we lost when split(' ')-ing the text
          overflow.length > 0
            ? parent.insertAdjacentText('beforeend', `${overflow} `)
            : parent.insertAdjacentText('beforeend', ' ');
        }
      }
    }
  }

  // Adding all elements to page
  for (const part of blogPost) {
    // Handy dandy function
    creatingCorrectElement(part, blogDocument);

    // If we are in a section we create section element, and create all the elements within
    // the section element with same function (because first parameter is the element we want to create and second parameter is where to add them (parent-element))
    if (part[0] === 'section') {
      const section = document.createElement('section');
      section.classList.add('blog-doc-section');
      blogDocument.appendChild(section);

      part[1].forEach(element => {
        creatingCorrectElement(element, section);
      });
    }
  }

  blogDocument.classList.remove('hide');

  const blogActive = document.querySelector('.blog-active');
  blogActive.scrollTo(0, 0);

  activateScrollbar(blogActive);
}

export default showCurrentBlogPost;
