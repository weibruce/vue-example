var app = new Vue({
        el:'#num',
        data:{
                name: 'sudoku',
                testText: 'welcome',
                nowIndex: 0,
                allNum: [],//数字排列
                answer: [],//所有答案的坐标点
                allNumText: [],//数字，包括输入后的数字
                curRow: '',//当前格子所在的行的索引
                curCol: '',//当前格子所在的列的索引
                checkShow: false,//数字键盘的显示
                hoverCol: '',//鼠标进去的当前列
                hoverRow: 0,//鼠标进入的当前行
                numShow: true,//数独的显示
                optionNow: {},//输入后的格子的坐标
                optionNowInRow: {},//和输入后的格子在同一行，并且同样值的格子的坐标
                optionNowInCol: {},//和输入后的格子在同一列，并且同样值的格子的坐标
                isErr: false,//是否输入错误后
                isShake: false//是否显示震动的样式
        },
        methods: {
            /**
             * @description 显示数字键盘
             * @param i1
             * @param i2
             */
            showCheck(i1, i2){
                //点击的格子是否是被掏空的格子
                if (this.allNum[i1][i2] !== '') {
                    return
                }
                //点击的格子如果是上一次点击的格子（当前格子）
                if (i1 === this.curRow && i2 === this.curCol) {
                    //隐藏数字键盘，curRow和curCol设空
                    this.checkShow = false;
                    this.curRow = '';
                    this.curCol = '';
                }
                else {
                    //隐藏数字键盘，curRow和curCol分别设置成当前的点
                    this.checkShow = true;
                    this.curRow = i1;
                    this.curCol = i2;
                }
            },
            inputText(_text){
                //*****************************检查前的初始化
                let _row = this.curRow, _col = this.curCol;
                this.curRow = '';
                this.curCol = '';
                this.isErr = false;
                this.optionNow = {
                    x: '',
                    y: '',
                }
                this.optionNowInRow = {
                    x: '',
                    y: '',
                }
                this.optionNowInCol = {
                    x: '',
                    y: '',
                }
                //*****************************检查行
                //保存当前格子的值
                this.allNumText[_row][_col] = _text;
                let rowCheck = Object.assign(this.allNumText[_row], []);
                this.checkShow = false;
                for (let i = 0, len = rowCheck.length; i < len; i++) {
                    //如果值一样，但是坐标不一样，就是填写错误
                    if (_text === rowCheck[i] && _col !== i) {
                        this.isErr = true;
                        this.isShake = true;
                        //记录当前格子的信息
                        this.optionNow = {
                            x: _row,
                            y: _col
                        }
                        //记录和当前格子同一行，以及同一个值的格子的坐标
                        this.optionNowInRow = {
                            x: _row,
                            y: i
                        }
                    }
                }
                //*****************************检查列
                let colCheck = [];
                //首先把每一行的那一列的数值保存起来
                for (let i = 0, len = this.allNumText.length; i < len; i++) {
                    colCheck.push(this.allNumText[i][_col]);
                }
                //遍历检查
                for (let i = 0, len = colCheck.length; i < len; i++) {
                    //如果值一样，但是坐标不一样，就是填写错误
                    if (_text === colCheck[i] && _row !== i) {
                        this.isErr = true;
                        this.isShake = true;
                        //记录和当前格子同一列，以及同一个值的格子的坐标
                        this.optionNowInCol = {
                            x: i,
                            y: _col
                        }
                    }
                }
                //如果发现的同样的
                if (this.isErr) {
                    setTimeout(() => {
                        this.isShake = false;
                    }, 1000)
                    return;
                }
                //如果数组去重后，长度小于9，就是行没完成
                rowCheck = rowCheck.filter(item => item !== '');
                if (rowCheck.length !== 9) {
                    console.log('row donot complete')
                    return;
                }

                let coloCheck = [];
                //如果数组去重后，长度小于9，就是列没完成
                for (let i = 0, len = this.allNumText.length; i < len; i++) {
                    coloCheck = [...new Set(this.allNumText[i])];
                    coloCheck = coloCheck.filter(item => item !== '');
                    if (coloCheck.length !== 9) {
                        console.log('column donot complete')
                        return;
                    }
                }
                alert('You Win this Sudoku!!');
                this.numShow = false;
            }
        },
        mounted(){
            let arr1 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            let row = [], rowCol = 0;
            for (let i = 0, len = arr1.length; i < len; i++) {
                row = Object.assign([], arr1);
                this.allNum.push(row);
                rowCol = arr1.splice(0, 1)[0];
                arr1.push(rowCol)
            }
            //打乱行
            this.allNum.sort((n1, n2) => Math.random() - 0.5);
            //随机获取两列的索引
            function randomText() {
                let rondomIndex = 0, rondomIndexAfter = 0;
                //获取第一列的索引
                rondomIndex = Math.floor(Math.random() * 9);
                function randomDo() {
                    rondomIndexAfter = Math.floor(Math.random() * 9);
                    //如果第一列和第二列索引一样，第二列的索引再次重新获取
                    if (rondomIndexAfter === rondomIndex) {
                        randomDo();
                    }
                }

                randomDo();
                //返回两列的索引
                return [rondomIndex, rondomIndexAfter]
            }

            //打乱列
            let randomArr = [], nowValue = 0;
            //同样遍历9次
            for (let i = 0; i < 9; i++) {
                randomArr = Object.assign([], randomText());
                //遍历每一行，给每一行的随机两列交换值
                for (let j = 0, len = this.allNum.length; j < len; j++) {
                    //随机两列交换值
                    nowValue = this.allNum[j][randomArr[0]];
                    this.allNum[j][randomArr[0]] = this.allNum[j][randomArr[1]];
                    this.allNum[j][randomArr[1]] = nowValue;
                }
            }

            //记录所有坐标
            let rowText = '', arrText = []
            for (let i = 0; i < 9; i++) {
                rowText = ''
                for (let j = 0; j < 9; j++) {
                    rowText += i + '-' + j + ',';
                }
                arrText.push(rowText.substr(0, rowText.length - 1))
            }
            console.log(arrText);
            //随机掏空
            let nowItme = [], _option, nowOption = [];
            for (let i = 0; i < 9; i++) {
                //抽取当前行的所有坐标
                nowItme = arrText[i].split(',');
                nowOption = [];
                //当前行的随机两个坐标掏空
                for (let j = 0; j < 2; j++) {
                    //抽取当前行的随机一个坐标
                    _option = Math.floor(Math.random() * nowItme.length);
                    //分割坐标的x,y
                    nowOption = nowItme.splice(_option,1)[0].split("-");
                    this.allNum[nowOption[0]][nowOption[1]] = '';
                }

            }
            //深度拷贝数独的数字
            this.allNumText = JSON.parse(JSON.stringify(this.allNum));
        }
    });