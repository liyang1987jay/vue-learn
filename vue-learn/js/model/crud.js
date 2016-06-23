var vm = new Vue({
    el: "#app",
    ready: function () {
        this.$http.get("../data/books.json")
            .then(function (response) {
                // success callback
                this.$set("books", response.data);
            }, function (response) {
                //error callback
                console.log(response.status());
            })
    },
    data: {
        sortParam: '',
        sortOrder: 1,
        flag: true,
        books: '',
        book: {
            author: '',
            name: '',
            price: ''
        },
        editBook: null
    },
    computed: {
        sum: function () {
            var totalPrice = 0;
            for (var i = 0; i < this.books.length; i++) {
                totalPrice += Number(this.books[i].price);
            }
            return totalPrice;
        }
    },
    methods: {
        delBook: function (book) {
            var self = this;
            layer.open({
                content: "确定删除吗?",
                yes: function (index) {
                    self.books.$remove(book);
                    layer.close(index);
                }
            })

        },
        handleBook: function (bk) {
            if (bk.id == undefined) {
                if (validate.checkForm()) {
                    //添加记录
                    this.book.id = this.books.length + 1;
                    this.books.push(this.book);
                    this.book = '';
                }
            } else {
                //修改
                //this.book = bk;
                //if (validate.checkForm()) {
                Object.assign(this.editBook, bk);
                this.book = '';
                this.flag = !this.flag;
                //}
            }
        },
        updateBook: function (bk) {
            this.editBook = bk;
            this.book = Object.assign({}, bk);
            this.flag = !this.flag;
        },
        sortBy: function (sortParam) {
            if (this.sortParam = sortParam) {
                this.sortOrder = -this.sortOrder;
                return;
            }
            this.sortParam = sortParam;
            this.sortOrder = 1//默认正序排序
        }
    }
})
var validate = {
    checkForm: function () {
        return $("#form1").validate({
            rules: {
                book_name: "required",
                book_author: "required",
                book_price: "required",
            },
            messages: {
                book_name: "请填写书名",
                book_author: "请填写作者",
                book_price: "请填写价格",
            },
            errorElement: "em",
            errorPlacement: function (error, element) {
                error.addClass("help-block");

                if (element.prop("type") === "checkbox") {
                    error.insertAfter(element.parent("label"));
                } else {
                    error.insertAfter(element);
                }
            },
            highlight: function (element, errorClass, validClass) {
                $(element).addClass("has-error").removeClass("has-success");
                $(element).parents(".col-sm-10").addClass("has-error").removeClass("has-success");
            },
            unhighlight: function (element, errorClass, validClass) {
                $(element).addClass("has-success").removeClass("has-error");
                $(element).parents(".col-sm-10").addClass("has-success").removeClass("has-error");
            }
        }).form();
    }
}