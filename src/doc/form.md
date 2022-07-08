## 表单系统

### 1. 系统介绍

表单系统主要负责的是护理评估单的开发，包括一些不良事件表单。

### 2. 目录结构

下面介绍系统的目录结构，高亮表示常用

1. **dist目录**：项目打包存放的文件位置，其中目录里面``[医院名称]``目录就是打包生成的对应医院的表单html文件。

2. **src目录**：项目的源码目录

   1. **表单目录**：里面包括了每个医院的表单。

      1. **page.js**：每个医院项目文件下面都有一个 ``page.js``文件，``list``对象其主要配置医院所有表单名称和其对应路径，配置方式``[医院名称+表单名称]: [表单路径]``，``runPage``数组根据 ``list``对象开启或注释掉需要运行的表单。

   2. **api目录**：一些接口文件。

   3. **assets目录**：一些静态资源文件

   4. **common目录**：公共资源文件，用的最多的是表单公用的 ``mixin`` 目录的文件。

      1. **mixins目录**：Vue 中``mixin`` 混入，定义一些重复的方法和数据。目前表单主要用到的有 5 个 ``mixin`` 文件，``defaultFormType.mixin.js``，``listFormType.mixin.js``，``scoreFormType.mixin.js``以及``combinationFormType.mixin``，``newListFormType.mixin.js``。对应[默认格式表单]，[表格格式/多行格式表单]，[多列格式表单]，[组合类型表单] 和 [新版多行累表单]。

   5. **components目录**：公共组件目录，表单中用的比较多的组件有 ``base-select``、``base-time``、``customSelect``、

      ``customRadio``、``customCheckbox``。引入方式 ``import [组件名称] from '@/components/[组件名称目录]/[文件名称].vue'``，具体用法参考现有表单使用的方法。

   6. [plugin目录]：这个估计是老表单（包括老表单方式的重症单）的一些东西（我猜的），这个到时遇到的问题时候估计会找到这个目录取看代码。

   7. src剩下就一些其他的杂七杂八的目录，router路由，表单基本没有什么路由，store目录状态管理等一些目录。

3. **vue.config.js文件**：vue的配置文件，其中包括了表单系统配置的每个医院的运行的表单和代理。我们每次运行项目时都需要在这里，开启和注释对应医院，需要跑哪个医院的表单就开启 ``pages``对象对应的医院表单以及开启对应医院的 ``proxy``代理，proxy 一般用的时公司内网测试地址 ``192.168.1.54:[端口号]``，每个医院的端口号不同。

4. **publish.js**：项目部署的配置文件。

5. **package.json**：项目依赖包管理文件，以及项目运行入口。``npm run dev`` 或者 ``npm run serve``启动项目

### 3. 表单介绍

护理评估表单主要包括四种类型的表单，默认格式类型、表格格式/多行格式、多列格式。还有一种组合类型表单，这个应该是比较少。分别在对应目录存放，也有其他表单类型目录，在目录结构中已经介绍过了它们分别需要引入对应的四种 ``mixin``。各个类型的表单可以自己跑项目对应表单查看效果。

#### 1. 默认格式类型表单

主要是按照表单模板进行直接开发，通常使用div进行flex布局，一行一行的排版。根据后端配好的字段，将其双向绑定到对应填写内容框中，使用 editParams 对象保存。

mixin 引用方式 **views/index.vue**

```js
import commonMixin from "@/common/mixins/common.mixin.js";
import defaultFormType from "@/common/mixins/defaultFormType.mixin.js"
export default {
    mixins: [commonMixin, defaultFormType],
};
```

**views/pages/index.vue**

```vue
<div class="item-base">
    <span>意识：</span>
    <baseSelect  
      v-model="editParams.I100008" 
      id="I100008" 
      :option="['清楚', '嗜睡', '谵妄', '糊涂', '浅昏迷', '深昏迷']"
     />
</div>
<div class="item-base">
    <span>生命体征：</span>
    <span>T</span>
    <input v-model="editParams.I001982" style="flex:1">℃&nbsp;
    <span>P/HR</span>
    <input v-model="editParams.I001983" style="flex:1">
    <span>次/分&nbsp;</span>
    <span>R</span>
    <input v-model="editParams.I001984" style="flex:1">
    <span>次/分&nbsp;</span>
    <span>BP</span>
    <input v-model="editParams.I001985" style="flex:1">mmHg
</div>
```

上述代码中 ``I100008、I001982``等是后端给的字段，我们需要将它设置为 editParams 对象的属性绑定和保存数据，字段可以根据后端给的 formCode 表单编码（通常是 E 开头的，如E0278）在 YApi 提供的接口中查询到。

#### 2. 表格格式/多行格式

表格格式/多行格式基本也是按照模板进行开发，使用的是 table 表格布局，使用 v-for 循环行。使用 editList 保存每一行的数据。使用的字段通常是规定名称，一些额外填写的使用 relObj 保存，字段名称自定义。如：

mixin 引用方式 **views/index.vue**

```js
import commonMixin from "@/common/mixins/common.mixin.js";
import listFormType from "@/common/mixins/listFormType.mixin.js"
// views/index.vue
export default {
  mixins: [commonMixin, listFormType],
  components: { pages },
  data() {
    return {
      formType: 'eval', // 表单类型，固定 eval
      formApiCode: 'access_record_zsqy', // 表单 Code，这个很关键，每个表格类型的表单都会不一样，后端给的，表单的接口都会用到。
      onePageSize: 24, // 表格行数，也是每个 editList 数组的长度
      saveAllRow: false,
    };
  },
}
```

**views/pages/index.vue**

```vue
<!-- views/pages/index.vue -->
<!-- 表格主体 -->
<!-- 循环 editList 保存每一行，保证每一行都存入 editList -->
<tr 
    v-for="(trItem, trIndex) in editList[0]" 
    :key="trIndex + 'content'" 
    @click="handleRowClick(trItem)"
>
    <!-- tableCode2 是 pages/config.js 中定义的对象数组，里面包括表格的一些信息和后端的字段 -->
    <td
        v-for="(tdItem, tdIndex) in tableCode2"
        :key="trIndex + '_' + tdIndex"
        :colspan="tdItem.colSpan || 1"
        :rowspan="tdItem.rowSpan || 1"
     >
        <!-- 签名 -->
        <template v-if="tdItem.type === 'sign'">
            <div class="sign-con" @click="() => handleSign(trItem, tdItem.signType)">
                <img v-if="trItem[tdItem.code]" :src="signUrl(trItem[tdItem.code])" alt />
                <span v-else></span>
            </div>
        </template>
        <!-- 勾选 -->
        <template v-else-if="tdItem.type === 'select'">
            <customSelect 
            	:options="tdItem.optionList" 
                 @onSelect="val => setListData(trItem, tdItem.code, val)"
             >
                <input type="text" v-model="trItem[tdItem.code]" style="text-align: center;" />
             </customSelect>
        </template>
        <!-- 文本 -->
        <template v-else>
			<input v-model="trItem[tdItem.code]" />
        </template>
    </td>
</tr>
```

```js
// config.js
export const tableCode2 = [
  { code: 'dateStr' },
  { code: 'potion' },
  { code: 'heartRate' },
  { code: 'potion' },
  { code: 'heartRate' },
  { code: 'potion' },
  { code: 'heartRate' },
  { code: 'potion' },
  { code: 'heartRate' },
  { code: 'signerNo', type: 'sign' },
];
```

#### 3. 多列格式表单

多列格式比较特殊，它根据打印预览将分数（一般是分数）展示为多列，在有统计分数的表单会用到，可以通过控制打印列数，展示多少列。在信息系统中一个病人如果有相同的多列格式的表单，其他表单的分数都会在第一张单多列展示。使用的是 table 使用v-for循环布局行，通过 editParams 保存数据。具体效果可以打开多列格式表单查看效果。

mixin 引用方式 **views/index.vue**

```js
import commonMixin from "@/common/mixins/common.mixin.js";
import scoreFormTypeMixin from "@/common/mixins/scoreFormType.mixin.js";
export default {
    mixins: [commonMixin, scoreFormTypeMixin],
}
```



```js
// views/pages/index.vue 
这里是页面的主要布局组件
// views/pages/config.js
页面信息和字段文件
// views/index.vue
页面布局组件的父组件，页面布局组件中很多数据都从父组件中获取，以及 mixin 混入也这里导入
```

#### 4. 组合类型表单

使用的是，otherFormList 和 editParams 保存数据（例子：东莞谢岗/组合类型表单/外科首次护理记录单）

```js
import commonMixin from '@/common/mixins/common.mixin.js';
import combinationFormType from '@/common/mixins/combinationFormType.mixin.js';
export default {
  	mixins: [commonMixin, combinationFormType],
    data() {
        return {
            otherFormList: [
                {
                    code: 'stressinjury_xg',
                    idCode: 'I638005',
                    dataLength: 6,
                    data: Array.from({ length: 6 }, () => {
                        return {};
                    }),
                },
            ],
            formType:'eval',
        };
    },
}
```

```vue
<pages
       :saveParams.sync="saveParams"
       :editParams.sync="editParams"
       :tableData.sync="otherFormList[0].data"
       @onSignOrAudit="toSignOrAudit"
       @onMultiSign="toMultiSign"
       @onRowSign="rowSign"
/>
```



#### 5. 新版多行表单

多行类型表单的优化，使用的字段与editParams保存的字段相同，表单 formCode ==F== 开头，日期时间不使用 dateStr 和 timeStr 字段。更换为 recordYear，recordMonth，recordHour 字段。其余字段使用 F 开头字段，如（F410001）

用法与之前的多行表单差不多。需要注意的一个地方是 todoSave(null, true, false) 方法的第三个参数要传 false。

```vue
<!-- 左侧按钮集合 -->
<div class="page-bar_left">
    <button @click="()=>createNewForm()">新建</button>
    <button @click="()=>todoSave(null, true, false)">保存</button>
    <button @click="()=>delGroup()" v-if="!saveAllRow">删除选中</button>
    <button @click="()=>delForm()">删除整单</button>
    <button @click="()=>addNewPage()" v-if="!saveAllRow">新增一页</button>
</div>
```

第一个这个参数是手动传的保存的数据，传 null 就行，第二个参数表示保存成功是否重新加载，第三个是控制 relObj 是为JSON对象还是JSON字符串，具体可以去看 newListFormType.mixin.js 的 todoSave() 方法，

mixin 引用方式 **views/index.vue** 

```js
import commonMixin from '@/common/mixins/common.mixin.js';
import newListFormType from '@/common/mixins/newListFormType.mixin.js';
export default {
  mixins: [commonMixin, newListFormType],
  components: { pages },
  data() {
    return {
      formType: "eval",
      formApiCode: "F0011",
    }
  }
}
```

#### 6. 新版组合类型表单

新多行的衍生类型，新多行类型+默认类型组合，`mixin：newCombinationFormType.mixin.js` 或者 `ICUFormType.mixin.js` 

后者用于重症单，表单模板：前者：顺德龙江>组合类型表单>血液净化治疗护理单。后者：江门妇幼：重症单

```js
data() {
    return {
        // 需要创建的子表单，数组每个对象代表一张新多行的子表，主表是使用默认类型
        otherFormList: [
            {
                code: 'F0080',
                idCode: 'I551001',
                id: "",
                dataLength: 24,
                data: Array.from({ length: 24 }, () => {
                    return {};
                }),
            },
            {
                code: 'F0082',
                idCode: 'I551004',
                id: "",
                dataLength: 8,
                data: Array.from({ length: 8 }, () => {
                    return {};
                }),
            },
            {
                code: 'F0083',
                idCode: 'I551003',
                id: "",
                dataLength: 24,
                data: Array.from({ length: 24 }, (item, index) => {
                    return {
                        F083001: ``
                    };
                }),
            },
            {
                code: 'F0081',
                idCode: 'I551002',
                id: "",
                dataLength: 24,
                data: Array.from({ length: 24 }, () => {
                    return {};
                }),
            },
        ],
        formType:'eval',
        formApiCode: 'F0080'
    }
},
```



### 4. 新建一张表单步骤

1、首先确定医院并确定该表单属于什么类型的表单（四种类型）。

2、其次在表单目录对应医院表单类型目录中添加一份表单，可以复制已有的相似模板表单修改。

3、然后在对应医院目录的page.js中添加新建表单的配置路径。注意表单名称要一致。

```js
let list = {
  // 重症单
  '东莞谢岗危重症监护单': 'src/表单/东莞谢岗/重症单/危重症监护记录单/main.js',
  // 组合类型表单
  '东莞谢岗首次护理记录单-外科': 'src/表单/东莞谢岗/组合类型表单/外科首次护理记录单/main.js',
  '东莞谢岗疼痛护理记录单': 'src/表单/东莞谢岗/组合类型表单/外科首次护理记录单/main.js',
  // 多列类型表单
  '东莞谢岗引流管护理记录单': 'src/表单/东莞谢岗/多列类型表单/引流管护理记录单/main.js',
  '东莞谢岗外固定护理单': 'src/表单/东莞谢岗/多列类型表单/外固定护理单/main.js',
  '东莞谢岗病人约束护理单': 'src/表单/东莞谢岗/多列类型表单/病人约束护理单/main.js',
  // 表格类型表单
  '东莞谢岗相关性尿路感染监测护理单': 'src/表单/东莞谢岗/多行类型表单/相关性尿路感染监测护理单/main.js',
  // 默认类型表单
};
```

1、最后在表单页面中根据模板完成开发以及接好字段。

2、运行这张单就在 page.js 中将其开启，运行对应医院即可。

```js
let runPages = [
  // -----------------  重症单  -----------------
  '东莞谢岗危重症监护单',
  // -----------------  组合类型表单 ----------------
  // '东莞谢岗首次护理记录单-外科', //待发包测试 9-2
  // '东莞谢岗疼痛护理记录单',//待发包测试 9-2
  // -----------------  多列类型表单 ----------------
  '东莞谢岗引流管护理记录单',
  '东莞谢岗外固定护理单',
  '东莞谢岗病人约束护理单',
  // -----------------  多行类型表单 ----------------
  '东莞谢岗相关性尿路感染监测护理单',
  // -----------------  默认类型表单 ----------------
];
```

## 表单获取患者入院信息

接口方法 getPhoneNum()

```js
 methods: {
    /**初始化表单 */
    init() {
      if (!this.baseParams.id) {
        this.createNewForm();
      } else {
        this.getFormData(
          () => {
          },
          async res => {
            const patient = res.data.master;
            // 获取入院信息接口 getPhoneNum
            const {data} = await  getPhoneNum(patient.patientId, patient.visitId);
            this.phoneNum = data.data.phone;
            this.occupation = data.data.occupation;
            this.nation = data.data.nation;
            this.diagnosis = data.data.diagnosis;
            // 联系电话
            this.editParams.I311001 = this.editParams.I311001 ? this.editParams.I311001 : this.phoneNum || '';
            //职业
            this.editParams.I400001 = this.editParams.I400001 ? this.editParams.I400001 : this.occupation || '';
            //民族
            this.editParams.I400002 = this.editParams.I400002 ? this.editParams.I400002 : this.nation || '';
            // 入院诊断
            this.editParams.I311007 = this.editParams.I311007 ? this.editParams.I311007 : this.diagnosis || '';
            
          }
        );
      }
    },
 }
```

## 打开关联表单

有些表单需求是需要在当前表单点击某个地方打开关联表单获取数据，如：分数。或者创建并填写另一张单。

参考：**贵州省人民医院/评估单/入院评估单（内科）**，如：

```vue
<!--views/pages/index.vue-->
<!-- 点击压力性损伤打开新建 E0278 贵州人医院外带入压力性损伤报告表.html -->
<span @click="handleOpenForm('E0278')">
    <baseSelect 
      type="checkbox" 
      v-model="editParams.I311032" 
      id="I311032" 
      :option="['压力性损伤']" 
    />
</span>
<!-- 打开关联表单获取分数 -->
<span class="clickable" @click="()=>handleOpenForm('E0065_2')">自理能力评估：</span>
<span>评分<input v-model="editParams.S0002">分；</span>
```

方法 handleOpenForm([表单编码])，参数为表单编码

```js
// views/pages/index.vue
handleOpenForm(formCode) {
      let params = null;
      switch (formCode) {
        case "E0278": {
           params = {
            formCode,
            formId: this.editParams.E0278 || "",
            showSignBtn: true,
            title: "贵州人医院外带入压力性损伤报告表",
            formUrl: "贵州人医院外带入压力性损伤报告表.html",
            callback: (payload) => {
              let newEditParams = {...this.editParams};
              newEditParams.E0278 = payload.master.id;
              this.setEditParams(newEditParams);
            },
          };
          break;
        }
        case "E0065_2": {
          params = {
            formCode,
            formId: this.editParams.E0065_2 || "",
            showSignBtn: true,
            title: "贵州人医患者护理分级评估单",
            formUrl: "贵州人医患者护理分级评估单.html",
            callback: (payload) => {
              let newEditParams = {...this.editParams};
              newEditParams.E0065_2 = payload.master.id;
              const score = payload.master.evalScore
              newEditParams.S0002 = score
              if (+score <=2) {
                newEditParams.I254030 = '低风险（≤2分）'
              } else if (+score >= 3) {
                newEditParams.I254030 = '高风险（≥3分）'
              } 
              this.setEditParams(newEditParams);
            },
          };
          break;
        }
      }
    // 在父组件views/index.vue中实现
    if (params) this.$emit("openRelationModal", params);
}
```

```js
// views/index.vue
handleLationModal(params) {
    console.log(params);
    console.log(this.baseParams,'this.baseParams');
    // 这个方法是 defaultFormType.mixin.js 中的方法，想深入了解可以去看，那里还会牵扯到信息系统
    this.openRelationFormModal({
        query: {...this.baseParams, id: params.formId || "",patientName:this.baseParams.name||''},
        formCode: params.formCode,
        title: params.title,
        formUrl: params.formUrl,
        showSignBtn: params.showSignBtn,
        callback: params.callback,
    });
},
```



## 签名方法

### 1. handleSignOrAudit(type)

责任签名或者审核签名，多用于多列和默认类型表单，根据传入的参数 type 判断是普通签名还是审核签名，type 的值可以有三种 sign，audit，和 both。 sign 是普通签名，audit 是审核签名，both是两个，签名字段对应 signerNo 和 auditorNo 。对应 mixin 的 toSignOrAudit() 方法。例子：

```vue
<div class="item-base no-border">
    <span>记录时间：</span>
    <baseTime v-model="saveParams.evalDate"/>
    <span style="margin-left: 80px;">责任护士签名：</span>
    <span class="sign-con" @click="()=>handleSignOrAudit('sign')">
        <img v-if="saveParams.signerNo" :src="signUrl(saveParams.signerNo)"/>
        <span v-else></span>
    </span>
</div>
<div class="item-base no-border">
    <span>审核时间：</span>
    <baseTime v-model="saveParams.auditTime"/>
    <span style="margin-left: 80px;">审核人签名：</span>
    <span class="sign-con" @click="()=>handleSignOrAudit('audit')">
        <img v-if="saveParams.auditorNo" :src="signUrl(saveParams.auditorNo)"/>
        <span v-else></span>
    </span>
</div>
/**签名和审核 */
handleSignOrAudit(type) {
	this.$emit('onSignOrAudit', type);
},
```

### 2. handleSign(rowItem)

行数据签名方法，用于多行（表格）类型表单，参数 rowItem 为对应行传入的 editList 遍历出来的对象，对应 mixin 的 

rowSign(rowItem, signType = ‘0’, signCode) 方法，signCode 不传使用的是 signerNo。例如：

```vue
<!-- trItem 就是 editList 遍历出的行对象，tdItem.code 是在 config.js 中某个数组对象的属性 -->
<div class="sign-con" @click="()=>handleSign(trItem)">
    <img v-if="trItem[tdItem.code]" :src="signUrl(trItem[tdItem.code])" alt/>
    <span v-else></span>
</div>
handleSign(rowItem) {
	this.$emit("onRowSign", rowItem);
},
```

### 3. handleMultiSign(code)

其他类型护士签名，适用情况： 表单有2个以上签名，或者签名不分先后，没有明显的层级关系，对应 mixin 的 toMultiSign() 方法。

```js
// defaultFormType.mixin.js
toMultiSign(
    config = {
        signerNoCode: '', //用于保存签名工号的表单字段
        signDateCode: '', //用于保存签名时间的表单字段
        signTitle: '', //用于展示签名名称信息
        needRealSign: false, //是否需要请求真实的签名接口(一个表单有且只能有一个字段签名能为true) 且true不能与toSignOrAudit同时存在
    }
)
```

```vue
<span class="sign-con" @click="() => handleMultiSign(item.three)">
    <img v-if="editParams[item.three]" :src="signUrl(editParams[item.three])" />
    <span v-else></span>
</span>
/* 签名 */
handleMultiSign(signerNoCode, needRealSign = false, title) {
    this.$emit('onMultiSign', {
    signerNoCode,
    needRealSign,
    signTitle: title || '',
    });
},
```

### 4. toOtherSign(code) （新版多行不适用）

整单签名，signMap整单其他签名

交班者/接班者签名

在表格格式 + relObj 保存数据。且这个签名不在表格遍历之中，可以参考下面写法。

```vue
<td colspan="2">交接班签名<br/>交班者/接班者</td>
<td colspan="4">
    <div class="dl">
        <span class="sign-con" @click="()=>toOtherSign('signer2')">
            <img v-if="signerMapNo('signer2No')" :src="signUrl(signerMapNo('signer2No'))" alt/>
            <span v-else></span>
        </span>/
        <span class="sign-con" @click="()=>toOtherSign('signer3')">
            <img v-if="signerMapNo('signer3No')" :src="signUrl(signerMapNo('signer3No'))" alt/>
            <span v-else></span>
        </span>
    </div>
</td>
```

```js
// signerMapNo 方法
signerMapNo(signerTypeNo) {
    if (this.saveParams.signMap)
    return this.saveParams.signMap[signerTypeNo] || "";
},
```

使用的是 toOtherSign([code]) 方法，img 标签的 v-if 判断 `signerMapNo([code + ‘No’])` 可以判断 `this.saveParams.signMap[signerTypeNo]`是否有该字段， 为什么要加上 `No` 可以去看 `listFormType.mixin.js` 中 `toOtherSign ` 方法

```js
// toOtherSign 方法, 这里得去 listFormType.mixin.js 找方法
 toOtherSign(type) {
     this.$emit('toOtherSign', type)
 }
 // listFormType.mixin.js 中 toOtherSign 方法的其中一部分，
 toOtherSign(signerType = '') {
     if (!signerType) return;
     let $iframeLoading = iframeLoading();
     let isSign = !!this.saveParams.signMap[signerType + 'No'];
     };
```

可以看到，方法中参数 signerType （也就是我们传入的字段 code）默认未空，当我们从组件中调用 `toOtherSign` 方法传入一个 [code] 时，经过 `this.saveParams.signMap[signerType + 'No']` 此时，传入的 [code] 会变拼接上 `No` 字符串。所以我们在组件中若要拿到签名信息，必须在传入的字段 [code] 的基础上加上 `No` 字符串。



## 新版多行

**mixin：newListFormType.mixin.js**

### 1. 行签名方法

指一行里对应一个普通签名（signerNo）和一个审核签名(auditorNo，审核签名比较少用到)，

mixin中的方法 rowSign(rowItem, signType, signCode)，

方法参数：

rowItem 对应行，也就是 editList 中的其中一行；

signType 默认是 false，为 true 时是审核签名；

signCode: 签名字段，普通签名为 signerNo，审核签名是 auditorNo。

签名使用：

```vue
<span class="sign-con" @click="() => handleSign(rowItem)">
    <img v-if="rowItem['signerNo']" :src="signUrl(rowItem['signerNo'])" alt/>
    <span v-else></span>
</span>
<span class="sign-con" @click="() => handleSign(rowItem, true, 'auditorNo')">
    <img v-if="rowItem['auditorNo']" :src="signUrl(rowItem['auditorNo'])" alt/>
    <span v-else></span>
</span>
```



### 2. 表外签名方法

指多行表格外的签名，用于表外的单个责任护士签名/审核签名。

mixin方法 toSignOrAudit(type = ’sign‘)

参数：type 默认为 sign(String类型)，sign=>表示责任护士签名，audit=>表示审核签名（质控护士签名）。

方法使用

```vue
<span class="sign-con" @click="() => handleSignOrAudit('sign')">
    <img v-if="saveParams.signerNo" :src="signUrl(saveParams.signerNo)" />
    <span v-else></span>
</span>
<span class="sign-con" @click="() => handleSignOrAudit('audit')">
    <img v-if="saveParams.auditor" :src="signUrl(saveParams.auditor)" />
    <span v-else></span>
</span>
```



### 3. 表外普通签名（不带状态）

适用于表外的多个签名，且不带状态的。使用 relObj 保存签名

mixin 方法 relObjSign(code),

参数：code => relObj 保存的字段

方法使用

```vue
<span class="sign-con" @click="() => handleRelObjSign('F016034')" style="width:100px">
    <img v-if="relObj.F016034" :src="signUrl(relObj.F016034)" />
    <span v-else></span>
</span>
```

### 4. 多行表内字段签名

使用的是后端配置的字段进行普通签名，适用于表内的多个除责任护士之外的普通护士签名。存入到对应行内。

mixin 方法 newRowSign(rowItem, code)

参数：rowItem => 对应多行中的任一行，code => 后端配置的普通护士签名字段(F00XXX)

方法使用：

```vue
<div class="sign-con" @click="()=>handleNewRowSign(data, oItem.code)">
    <img v-if="data[oItem.code]" :src="signUrl(data[oItem.code])" alt/>
    <span v-else>未签名</span>
</div>
```

## 📃 重症单

分为旧重症单（南医三，谢岗等，看不懂），和新重症单（江门妇幼等，勉强能接受吧），自己去看吧，感受痛苦吧。

## 📅产程图

重点说一下花都的产程图，比较恶心一点的地方。

### 1、双平行线起点坐标定义

a、宫口扩张有小于 3 情况，拿第一个小于 3 的点与第一个大于 3 的点连线相交于扩张 y = 3 的点作为起点坐标

b、若没有小于 3 的点，则拿 0 点与第一个大于 3 的点连线交与 y = 3的点作为起点

c、恰好有等于 3 的扩张，则用该点作为起点坐标 

其中 a、b 情况需要使用两点坐标求直线方程，再求直线方程与直线 y = 3 的交点坐标。

```js
// config.js
// 所有扩张点数据
const expandPoints = arr[arr.length - 4]
// 是否有扩张等于3的点
const isExpandEqual3 = expandPoints.find(item => +item.y == 3)
// 小于3的点
const allSmaller3Point = expandPoints.filter(item => +item.y < 3)
// 起点（有小于3的点时，拿最后一个小于3的点，没有时拿0点）
const startPoint = allSmaller3Point.length ? getPointArr([allSmaller3Point[allSmaller3Point.length - 1]], expandCurve, startTime) : [{ x: 0, y: (0 - expandCurve.minValue) / expandCurve.scale }]
// 动态两点的直线方程（扩张大于3的第一个点和最后一个小于3的点)或者(第一个扩张大于3的点和0点的连线)
const big3Point = expandPoints.find(item => +item.y > 3)
const dynamicLine = big3Point && [
    // ...getPointArr([allSmaller3[allSmaller3.length - 1]], expandCurve, startTime),
    // { x: 0, y: (0 - expandCurve.minValue) / expandCurve.scale },
    ...startPoint,
    ...getPointArr([big3Point], expandCurve, startTime),
]
// 如果有扩张等于3的点, 获取等于3的点的坐标
const expandEqual3Point = isExpandEqual3 && getPointArr([isExpandEqual3], expandCurve, startTime)[0]
// 已知直线方程和y=?(默认为3)直线方程求两直线交点坐标
const getIntersectPoint = (pointOne, pointTwo, y = 3) => {
    // 将 y = 3 转为实际坐标
    y = (+y - expandCurve.minValue) / expandCurve.scale;
    // 两点求直线方程(x-x1)/(x2-x1) = (y-y1)/(y2-y1)得出 x 得如下, 
    let x = ((y - pointOne.y) * (pointTwo.x - pointOne.x) / (pointTwo.y - pointOne.y)) + pointOne.x
    return {
        x,
        y
    }
}
// 获取扩张等于3的交点坐标
const intersectPoint = isExpandEqual3 ? expandEqual3Point : (dynamicLine ? getIntersectPoint(...dynamicLine) : [])
```

### 2. 多胎连线

要求多个胎儿娩出点和胎头下降箭头连线显示，显示分娩信息，顺产使用实线，其他使用虚线连接。具体边看边理解吧，说不清楚。

```js
// config.js => line 343
// 胎头=>箭头
const exposeToArrow = deliveryTimeDiff > 30 ? [
    {
        points: birthLineTwo,
        color: 'blue',
        dasharray: isDasharray2 ? '' : '2 2',
    },
    // 胎头下降到箭头的连线3
    {
        points: birthLineThree,
        color: 'blue',
        dasharray: isDasharray3 ? '' : '2 2',
    },
] : []
const baseLine = [
	...
    // 胎头下降到箭头的连线1
    birthLine && {
      points: birthLine,
      color: 'blue',
      dasharray: isDasharray1 ? '' : '2 2',
    },
    // 胎头下降到箭头的连线2和3
    ...exposeToArrow,
]
```



##  新多行按时间排序（自定义字段）

如果需求需要按照时间排序，但是日期时间不是接的默认字段（recordMonth，recordHour）而是使用自定义字段`F`开头的字段。

使用方式：在引入 `mixin` 的 `vue` 文件的 `data` 函数中添加属性 `sortCode`，值为你需要时间排序的自定义字段。

具体实现：`newListFormType.mixin.js` ，想了解的可以看下面两段代码（目前是没有发现 bug），有发现bug的话帮忙修复一下

1、获取数据时处理

```js
// 获取数据，根据时间字段排序
sortListByCode(list, code) {
    return list.sort((a, b) => {
        if (a[code] && b[code]) {
            if (a[code] == b[code]) {
                return moment(b.recordDate).diff(moment(a.recordDate))
            } else {
                return moment(a[code]).diff(moment(b[code]))
            }
        } else {
            return 1
        }
    })
},
```

2、保存数据需要保证 `recordDate` 相同日期放一起，且相同 `recordDate` 的第一条数据的 `recordMonth` 和 `recordHour` 不能为空，这是因为后端在处理相同日期时，会把相同日期或者时间的置空，只留一条同个日期或者时间的，且是相同日期或者时间的第一条。

```js
// 保存数据，格式化已排序的数据
formatSortList(list = []) {
    list = list.sort((a, b) => {
        if (a.recordDate && b.recordDate) {
            return moment(a.recordDate).diff(moment(b.recordDate))
        } else {
            return 1
        }
    })
    for (let index in list) {
        if (list[index].recordMonth) {
            const i = list.findIndex(
                item => moment(item.recordDate).format('MM-DD') == moment(list[index].recordDate).format('MM-DD')
            )
            if (i != index) {
                let temp = list[i]
                list[i] = list[index]
                list[index] = temp
            }
        }
    }
    return list
},
```



## 多列表单按科室分开打印

需求：多列表单出现转科时，打印时将不同科室分开纸张打印，且每张单科室对应。

具体用法：参照武汉肺科>多列表单>压疮发生危险因素量化评估表

`:saveParams.sync="printItemList[idx][1]" ` 表头科室分开打印时对应

`:transferDeptPrintDataItem.sync="printItemList[idx][1]"` 这个是如果需要每页都拿对应科室的最后一条数据

```vue
<pages
       v-if="!isPrintPreview"
       :saveParams.sync="saveParams"
       :editParams.sync="editParams"
       @onSignOrAudit="toSignOrAudit"
       @onMultiSign="toMultiSign"
       />
<template
          v-else
          v-for="(pageItem,idx) in printList"
          >
<pages
       :key="idx"
       :currentPrintList="pageItem"
       :saveParams.sync="printItemList[idx][1]"
       :editParams.sync="editParams"
       :isPrintPreview="true"
       :lastPrintDataItem.sync="lastPrintDataItem"
       :transferDeptPrintDataItem.sync="printItemList[idx][1]"
       />
</template>
```

具体实现：`scoreFormType.mixin.js` 打印预览接口

```js
getAllByPV(this.baseParams).then(
    res => {
        let resList = res.data.data || [[]];
        let printList = [];
        this.printPageList = []
        let size = this.printPageItemSize;

        resList = this.sortList(resList);
       	// 具体实现
        // 开始
        // 按科室分类， classifyDept 方法在下面
        let obj = this.classifyDept(resList)
        for (const value in Object.values(obj)) {
            this.printPageList.push(Object.values(obj)[value])
        }
        // 有转科，按科室分开打印
        if (parent.window.app.HOSPITAL_ID == 'whfk') {
            // 一层遍历，遍历有多少科室
            for (let i = 0; i < this.printPageList.length; i++) {
                // 二层遍历，每个科室有多少张表单
                for (let j = 0; j < this.printPageList[i].length; j++) {
                    let item = this.printPageList[i][j] || {};
                    // 添加新页
                    if (j % size === 0) {
                        printList.push([])
                    }
                    let printListLength = printList.length;
                    // 打印时把数据填上去
                    printList[printListLength - 1].push({
                        ...item.itemData,
                        ...item.master,
                    });
                }
                let lastPageData = printList[printList.length - 1];
                // 需要补的列数
                let resSize = size - lastPageData.length;
                // 补满每页不够定义的列数
                if (resSize > 0) {
                    while (resSize--) {
                        lastPageData.push({});
                    }
                }
            }
            // 获取每页的第一条和最后一条数据
            this.printItemList = new Array(printList.length).fill().map(() => new Array(2).fill({}))
            for (let i = 0; i < this.printItemList.length; i++) {
                this.printItemList[i][0] = printList[i][0]
                for (let j = 0; j < printList[i].length; j++) {
                    if (printList[i][j].id) {
                        this.printItemList[i][1] = printList[i][j]
                    }
                }
            }
        } 
        // 结束
        // 不需要按科室分开打印
        else {
            for (let i = 0; i < resList.length; i++) {
                let item = resList[i];
                if (i % size === 0) printList.push([]);

                let printListLength = printList.length;

                printList[printListLength - 1].push({
                    ...item.itemData,
                    ...item.master,
                });
            }
        }
        let lastPageData = printList[printList.length - 1];

        let resSize = size - lastPageData.length;
        if (resSize > 0)
            while (resSize--) {
                lastPageData.push({});
            }
        this.printList = printList;
        $iframeLoading?.setLoadingStatus(false);
        this.israding=true
    },
    err => this.loadingFailed()
);

//转科分类
classifyDept(pageList = []) {
    let obj = {}
    for (let i = 0; i < pageList.length; i++) {
        obj[pageList[i].master.deptCode] = obj[pageList[i].master.deptCode] || []
        obj[pageList[i].master.deptCode].push(pageList[i])
    }
    return obj
},
```









