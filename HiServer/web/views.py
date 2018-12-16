from django.shortcuts import render, HttpResponse
from django.views import View
from repository import models
import json
from django.http.request import QueryDict


# Create your views here.


class AssertView(View):

    def get(self, request, *args, **kwargs):
        return render(request, 'assert.html')


class AssertJsonView(View):

    def get(self, request, *args, **kwargs):
        table_config = [
            {
                'q': None,
                'title': '操作',
                'display': True,
                'text': {'content': '<input type="checkbox">', 'kwargs': {}},
                'attrs': {}
            },
            {
                'q': 'id',
                'title': 'ID',
                'display': True,
                'text': {'content': '{m}', 'kwargs': {'m': '&id'}},
                'attrs': {'edit_enable': False, 'edit_type': 'select'}
            },
            {
                'q': 'cabinet_num',
                'title': '机柜号',
                'display': True,
                'text': {'content': '{m}', 'kwargs': {'m': '&cabinet_num'}},
                'attrs': {'name':'cabinet_num','sel_id': '@cabinet_num','edit_enable': True, 'edit_type': 'input'}
            },
            {
                'q': 'device_type_id',
                'title': '资产类型ID',
                'display': True,
                'text': {'content': '{m}', 'kwargs': {'m': '@device_type_choices'}},
                'attrs': {'name':'device_type_id','sel_id': '@device_type_id','edit_enable': True, 'edit_type': 'select', 'global_name': 'device_type_choices'}
            },
            {
                'q': 'device_status_id',
                'title': '状态ID',
                'display': True,
                'text': {'content': '{m}', 'kwargs': {'m': '@device_status_choices'}},
                'attrs': {'name':'device_status_id','sel_id': '@device_status_id' ,'edit_enable': True, 'edit_type': 'select','global_name': 'device_status_choices'}
            },
            {
                'q': 'cabinet_order',
                'title': '机柜中序号',
                'display': True,
                'text': {'content': '{n}-{m}', 'kwargs': {'n': '&cabinet_num','m': '&cabinet_order'}},
                'attrs': {'name':'cabinet_order','sel_id': '@cabinet_order','edit_enable': True, 'edit_type': 'input'}
            },
            {
                'q': 'idc__name',
                'title': 'IDC机房',
                'display': True,
                'text': {'content': '{m}', 'kwargs': {'m': '&idc__name'}},
                'attrs': {'name':'idc__id','sel_id': '@idc__id','edit_enable': True, 'edit_type': 'select', 'global_name': 'idc_choice'}
            },
            {
                'q': 'idc__id',
                'title': 'IDCID',
                'display': False,
                'text': {},
                'attrs': {}
            },
            {
                'q': None,
                'title': '其他操作',
                'display': True,
                'text': {'content': '<a href="{n}-{m}.html">查看详情</a>', 'kwargs': {'n': 'admin','m':'&id'}},
                'attrs': {}
            },
        ]
        q_list = []
        for item in table_config:
            if item['q']:
                q_list.append(item['q'])
        data_list = models.Asset.objects.all().values(*q_list)
        print(data_list)
        result = {
            'table_config': table_config,
            'datalist': list(data_list),
            'global_dict': {
                'device_type_choices': models.Asset.device_type_choices,
                'device_status_choices': models.Asset.device_status_choices,
                'idc_choice': list(models.IDC.objects.values_list('id','name'))
            },
            'pager':"""
            <li>
      <a href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
    <li><a >1</a></li>
    <li><a >2</a></li>
    <li><a >3</a></li>
    <li><a >4</a></li>
    <li><a >5</a></li>
    <li>
      <a href="#" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
            """
        }

        return HttpResponse(json.dumps(result))

    def put(self, request, *args, **kwargs):
        content = request.body.decode()
        put_dict = QueryDict(request.body, encoding='utf-8')
        update_list = json.loads(put_dict.get('post_list'))
        print(update_list)
        ret = {
            'status': False,
            'message': '123123123'
        }
        return HttpResponse(json.dumps(ret))