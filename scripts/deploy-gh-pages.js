const pages = require("gh-pages");

pages.publish("docs", {dotfiles: true}, (err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log('Deployed site');
})