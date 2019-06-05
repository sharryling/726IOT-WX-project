var wxCharts = require('../../utils/wxcharts.js');
var app = getApp();
var lineChart = null;
var categories = []//[0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var data = []//[0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var lastTime = '';
var lastTempValue = '';
Page({
  data: {
    imei: '',
    channel: '',
    temp_value: '',
    timeStamp: ''
  }, 
  //触摸数据显示
  touchHandler: function (e) {
    console.log(lineChart.getCurrentDataIndex(e));
    lineChart.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },

  createSimulationData: function () {
    var that = this
    wx.request({
      url: 'http://localhost:8081/temperature',//'http://111.231.244.208:8081/temperature' + '?imei=' + that.data.imei,
      method: 'GET',
      success: function (res) {
        if (res.data.code == 0) {
          var timeS = new Date(res.data.res[0].timeStamp)
          lastTempValue = res.data.res[0].temp_value
          lastTime = timeS.getHours().toString().padStart(2, '0') + ':' + timeS.getMinutes().toString().padStart(2, '0') + timeS.getSeconds().toString().padStart(2, '0')

          categories.push(lastTime)
          data.push(lastTempValue)
          
          //lastTempValue = tempValue
          //lastTime = timeBufStamp
        }
      }
    })
    return {
      categories: categories,
      data: data
    }
  },
  updateData: function (simulationData) {
    //var simulationData = this.createSimulationData();

    var series = [{
      name: '温度',
      data: simulationData.data,
      format: function (val, name) {
        return val.toFixed(2) + '℃';
      }
    }];
    lineChart.updateData({
      categories: simulationData.categories,
      series: series
    });
  },
  getData: function (imei) {
    //console.log(imei)
    this.setData({
      imei: imei
    })
    var that = this
    wx.request({
      url: 'http://localhost:8081/temperature',//'http://111.231.244.208:8081/temperature' + '?imei=' + imei,
      method: 'GET',
      success: function (res) {
        //console.log(res)
        if (res.data.code == 0) {
          var timeS = new Date(res.data.res[0].timeStamp)
          var tempValue = res.data.res[0].temp_value
          var timeBufStamp = timeS.getHours().toString().padStart(2, '0') + ':' + timeS.getMinutes().toString().padStart(2, '0') + ':' +timeS.getSeconds().toString().padStart(2, '0')

          
          that.setData({
            temp_value: tempValue,
            timeStamp: timeBufStamp
          })

          if (lastTime != timeBufStamp) {
            if (categories.length >= 10) {
              categories = [],
                data = []
            }
            categories.push(timeBufStamp)
            data.push(tempValue)
            lastTempValue = tempValue
            lastTime = timeBufStamp
            
            that.updateData({
              categories: categories,
              data: data
            })
          }


        } else console.log("数据获取失败")
      }
    })
  },
  onLoad: function (options) {
    //获取温度数据
    this.setData({
      imei: options.imei
    })
    var that = this;
    this.t = setInterval(function () {
      that.getData(options.imei)
    }, 3000);

    //定时获取数据

    //charts
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    var simulationData = this.createSimulationData();
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: simulationData.categories,
      animation: false,
      // background: '#f5f5f5',
      series: [{
        name: '温度',
        data: simulationData.data,
        format: function (val, name) {
          return val.toFixed(2) + '℃';
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '温度（℃）',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 20,
        max: 25
      },
      width: windowWidth,
      height: 200,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  },

})