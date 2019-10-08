/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against the application.
 */

$(function() {

    describe('RSS Feeds', function() {
        /* Test to make sure that the allFeeds variable has been
         * defined and that it is not empty.
         */
        it('are defined', function() {
            expect(allFeeds).toBeTruthy();
        });


        /* This test loops through each feed in the allFeeds object
         * and ensures it has a URL defined and that the URL is not
         * empty.
         */
         it('URL of each feed is defined and not empty', function() {
            for (const feed of allFeeds) {
                expect(feed.url).toBeTruthy();
            };
         });


        /* Test that loops through each feed in the allFeeds object
         * and ensures it has a name defined and that the name is
         * not empty.
         */
        it('name of each feed is defined and not empty', function() {
            for (const feed of allFeeds) {
                expect(feed.name).toBeTruthy();
            };
         });
    });


    describe('The menu', function() {

        const initialClassList = document.body.classList;
        const menuIcon = document.getElementsByClassName('icon-list')[0];

        /* Test that ensures the menu element is hidden by default. */
         it('is hidden by default', function() {
            expect(initialClassList.contains('menu-hidden')).toBe(true);
         });


         /* Test that ensures the menu changes visibility when the menu icon is clicked. */
          it('toggles menu-hidden class on click of menu icon', function() {
            $(menuIcon).click()
            expect(document.body.classList.contains('menu-hidden')).toBe(false);
            $(menuIcon).click()
            expect(document.body.classList.contains('menu-hidden')).toBe(true);
        });
    });


    describe('Initial Entries', function() {

        /* Test that ensures when the loadFeed function is called and
         * completes its work, there is at least a single .entry element
         * within the .feed container.
         */
        beforeEach(function(done) {
            loadFeed(0, done);
        });

        it('has at least one entry', function() {
            expect($('.feed .entry').length).toBeGreaterThan(0);
        });
    });


    describe('New Feed Selection', function() {

        /* Test that ensures when a new feed is loaded by the
         * loadFeed function that the content actually changes.
         */
        let intialFeed;
        let newFeed;


        beforeEach(function(done) {
            loadFeed(0, ()=>{
                intialFeed = $('.feed')[0].innerText;
                loadFeed(1, ()=>{
                    newFeed = $('.feed')[0].innerText;
                    done();
                });
            });
        });

        it('updates the feed when new feed is loaded', function() {
            expect(newFeed).not.toBe(intialFeed);
        });

    });
    
}());
