const fs = require('fs');

const readline = require('readline');
const crypto = require('crypto');

// Main function for getting all blogposts
async function sendBlogPostsFromFolder(folderName) {
  /**
   *
   * BLOG-SYNTAX
   * _T = Main-title/header - x1 REQUIRED
   *  TimeStamp - x1 REQUIRED
   * _D = Description - x1 REQUIRED
   * _ID = Introduction x1 NOT REQUIRED
   * _UD = Undertitle - infinity
   * _C = Codeblock - infinity
   * < = Start of section
   * > = end of section
   *
   */

  const blogSyntax = {
    title: '_T',
    description: '_D',
    introduction: '_ID',
    undertitle: '_UT',
    code: '_C',
    sectionStart: '<',
    sectionEnd: '>'
  };

  const blogErrorLog = [];

  const allBlogs = [];

  const blogPostsForClient = [];

  let creationDates = [];

  // Main directory
  const mainDir = './' + folderName;

  // Getting the files from folderName (blog-posts)
  const folders = await fs.promises.readdir(mainDir);

  // Running through all folders in blog-posts folder
  for (const folder of folders) {
    // Running through all files in the folders in blog-post (will usually just be one, but maybe i want to categorize my blog-posts in the future)
    const folderFiles = await fs.promises.readdir(mainDir + '/' + folder);

    for (const file of folderFiles) {
      // Checking if file is a .txt file
      if (file.split('.')[1] !== 'txt') {
        continue;
      }

      // Creating the blogObject
      const blogObject = {
        id: '',
        creationdate: 0,
        title: '',
        timestamp: '',
        description: '',
        introduction: '',
        undertitles: [],
        codes: [],
        sections: [],
        elements: 0
      };

      // Keeping track of different flags for writing
      const blogFlags = {
        title: false,
        timestamp: false,
        description: false,
        introduction: false,
        inSection: false,
        index: 0
      };

      // Path of current file, used in readStream
      const thisPath = mainDir + '/' + folder + '/' + file;

      // Read the blogpost so we can create blogObject
      const readStream = fs.createReadStream(thisPath, 'utf8');

      // For reading every line in blogpost, used for parsing the text
      const rl = readline.createInterface({
        input: readStream,
        crlfDelay: Infinity
      });

      // Used for storing everything within an section
      let currentSection = [];

      // Storing creation date of file in this variable
      let creationDate = new Date();

      // Getting birthtime of file
      fs.stat(thisPath, function(err, stat) {
        if (err) {
          console.log(err);
        } else {
          creationDate = stat.birthtime.toString().split(' ');
          // Only showing Day Month Date Year
          creationDate.length = 4;

          blogObject.creationdate = stat.birthtimeMs;
          creationDates.push(blogObject.creationdate);

          // Making a string again
          creationDate = creationDate.join(' ');
        }
      });

      // Our checks for the paragraph-lines in blogtext
      for await (const line of rl) {
        // Checking if line is header, if it is add to blogObject and disable any more main-headers
        if (line.startsWith(blogSyntax.title)) {
          if (!blogFlags.title) {
            // Removing the flag and trimming text so unnecessary white space is removed
            blogObject.title = {
              title: line.replace(blogSyntax.title, '').trim(),
              index: blogFlags.index
            };

            // Creating unique id for every blogObject
            blogObject.id = crypto
              .createHmac('sha256', blogObject.title.title)
              .update('PickleRick')
              .digest('hex');

            blogFlags.title = true;
            blogFlags.index++;
          } else {
            blogErrorLog.push(
              `${line} could not be added as a title, because blog already has title: ${blogObject.title}`
            );
          }
          continue;
        }

        // Timestamp is automatically created by reading creatin date of file
        if (!blogFlags.timestamp) {
          // Creting timestamp
          blogObject.timestamp = {
            timestamp: creationDate,
            index: blogFlags.index
          };
          blogFlags.timestamp = true;
          blogFlags.index++;
          continue;
        }

        // Checking if line is description, if it is add to blogObject and disable any more descriptions
        if (line.startsWith(blogSyntax.description)) {
          if (!blogFlags.description) {
            // Removing the flag and trimming text so unnecessary white space is removed
            blogObject.description = {
              description: line.replace(blogSyntax.description, '').trim(),
              index: blogFlags.index
            };
            blogFlags.description = true;
            blogFlags.index++;
          } else {
            blogErrorLog.push(
              `${line} could not be added as a description, because blog already has description: ${blogObject.description}`
            );
          }
          continue;
        }

        // Checking if line is introduction, if it is add to blogObject and disable any more introductions
        if (line.startsWith(blogSyntax.introduction)) {
          if (!blogFlags.introduction) {
            // Removing the flag and trimming text so unnecessary white space is removed
            blogObject.introduction = {
              introduction: line.replace(blogSyntax.introduction, '').trim(),
              index: blogFlags.index
            };
            blogFlags.introduction = true;
            blogFlags.index++;
          } else {
            blogErrorLog.push(
              `${line} could not be added as a introduction, because blog already has description: ${blogObject.introduction}`
            );
          }
          continue;
        }

        // Checking if line is undertitle and we are not in a section, if it is add to blogObject
        if (line.startsWith(blogSyntax.undertitle) && !blogFlags.inSection) {
          blogObject.undertitles.push({
            undertitle: line.replace(blogSyntax.undertitle, '').trim(),
            // Index is the amount of sections - used for tracking the order of undertitles and sections
            index: blogFlags.index
          });
          blogFlags.index++;
          continue;
        }

        // Checking if line is code-block and we are not in a section, if it is add to blogObject
        if (line.startsWith(blogSyntax.code) && !blogFlags.inSection) {
          blogObject.codes.push({
            code: line.replace(blogSyntax.code, '').trim(),
            index: blogFlags.index
          });
          blogFlags.index++;
        }
        // Check if section starts. Creating an empty storage for everything in section and activating inSection-mode
        if (line.startsWith(blogSyntax.sectionStart)) {
          currentSection = [];
          blogFlags.inSection = true;
          continue;
        }

        // If section ends, go out of inSection-mode and add section to blogObject
        if (line.startsWith(blogSyntax.sectionEnd)) {
          blogObject.sections.push({
            section: currentSection,
            index: blogFlags.index
          });
          blogFlags.index++;
          blogFlags.inSection = false;
          continue;
        }

        // Parsing for section
        if (blogFlags.inSection) {
          // Checking if undertitle
          if (line.startsWith(blogSyntax.undertitle)) {
            currentSection.push({
              undertitle: line.replace(blogSyntax.undertitle, '').trim()
            });
          }
          // Checking if code-block
          else if (line.startsWith(blogSyntax.code)) {
            currentSection.push({
              code: line.replace(blogSyntax.code, '').trim()
            });
          }
          // If none of above, it's normal text
          else {
            currentSection.push({ text: line.trim() });
          }
          continue;
        }
      }
      // The amount of elements is equal to highest index
      blogObject.elements = blogFlags.index;

      // Add blogObject to allBlogs array
      allBlogs.push(blogObject);
    }
  }

  const blogsByCreationDate = [];

  // Sort the list with creationdates in descending order (last blog first);
  const orderedCreationDates = creationDates.sort((a, b) => {
    return b - a;
  });

  console.log(allBlogs);
  console.log(orderedCreationDates);

  // Add correct blogObjects based on creation dates
  orderedCreationDates.forEach(date => {
    blogsByCreationDate.push(allBlogs.find(b => b.creationdate === date));
  });

  // Looping through all blogposts
  for (let i = 0; i <= blogsByCreationDate.length - 1; i++) {
    // Creating the array for current blog-post. Pre-setting array with length of elements in blog-post
    // REMEMBER: ID IS REASON FOR NOT -1
    let thisPost = new Array(blogsByCreationDate[i].elements);

    for (const elements in blogsByCreationDate[i]) {
      // Current content in blogObject
      const elementContent = blogsByCreationDate[i][elements];

      // For ignoring the "elements" key in object
      if (typeof elementContent === 'number') {
        continue;
      }

      // If element is not an array, then just add key and value in correct place in "thisPost"-array (SHOULD HERE ALWAY BE OBJECT)
      if (!Array.isArray(elementContent)) {
        // Checking if there is any content, if not then don't add
        if (Object.keys(elementContent).length === 0) {
          continue;
        }

        // Dynamically storing what category current element is (for example title, description, codes etc.)
        const elementCategory = Object.keys(elementContent)[0];

        // Adding to thisPost-array
        thisPost[elementContent.index] = [
          elementCategory,
          elementContent[elementCategory]
        ];
      }
      // If element is an array, loop through all elements in this array aswell and correctly place them in the "thisPost"-array
      else {
        // Checking if there any content in element
        if (elementContent.length === 0) {
          continue;
        }
        for (const element of elementContent) {
          // Dynamically storing what category current element is (for example title, description, codes etc.)
          const elementCategory = Object.keys(element)[0];

          // Adding to thisPost-array
          thisPost[element.index] = [elementCategory, element[elementCategory]];
        }
      }
    }

    // Error-logging incase im stupid when writing blogs
    if (blogErrorLog.length > 0) {
      console.log(blogErrorLog);
    }

    // Adding the unique id to post
    thisPost.push(blogsByCreationDate[i].id);

    // Adding post to full list of all blog-posts which will be sent to client
    blogPostsForClient.push(thisPost);
  }

  const blogPostsJson = await JSON.stringify(blogPostsForClient);

  return blogPostsJson;
}

exports.sendBlogPostsFromFolder = sendBlogPostsFromFolder;
