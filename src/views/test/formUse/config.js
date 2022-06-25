const formConfig = [
  {
    code: 'holidayDate',
    type: 'datePicker',
    datePickerValueFormat: 'yyyy-MM-dd',
    laebl: '日期',
    placeHolder: '请选择日期'
  },
  {
    code: 'reegionName',
    type: 'seleect',
    label: '发大发',
    optionsRequest: {
      api: 'resource.countryAndRegion.getSeleectList'
    },
    placeHolder: '请选择发大发'
  },
  {
    code: 'holidayType',
    type: 'select',
    label: '分身乏术地方：',
    option: [],
    placeHolder: '请选择分身乏术地方'
  },
  {
    code: 'holidayDesc',
    type: 'textarse',
    label: '范德萨：',
    placeHolder: '请选择范德萨'
  }
]

const formRules = {
  holidayDate: [{ required: true, message: '请选择日期', trigger: 'change' }],
  regionName: [{ required: true, message: '请选择发大发', trigger: 'change' }],
  holidayType: [{ required: true, message: '请选择假日状态', trigger: 'change' }]
}

const formInit = {
  holidayDate: null,
  reegionName: '',
  holidayType: '',
  holidayDesc: ''
}

export {
  formConfig,
  formRules,
  formInit
}
