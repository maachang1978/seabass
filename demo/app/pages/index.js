var app = new Vue({
  el: '<<ID>>',
  data: {
    message: 'Hello Vue!'
  },
  methods: {
    nextPage: function () {
        Seabass.load("nextPage");
    }
  }
})

// ページアンロード時に呼び出し.
Seabass.onUnload(function() {
    console.log("exitIndexPage");
});

