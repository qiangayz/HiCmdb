(function () {
    var requesturl = null
    String.prototype.format = function (kwargs) {
        var res = this.replace(/\{(\w+)\}/g, function (groups, group) {
            return kwargs[group]
        });
        return res
    };
    function bind_check_all() {
        $('#select_all').click(function () {
            $('#table_td').find(':checkbox').each(function () {
                if($('#change_edit_mode').hasClass('btn-danger')){
                    if ($(this).prop('checked')){
                    }else{
                        change_tr_in_edit($(this).parent().parent());
                        $(this).prop('checked',true);
                    }
                }else{
                    $(this).prop('checked',true);
                }
            })
        })
    }
    function bind_reverse_all() {
        $('#reverse_all').click(function () {
            $('#table_td').find(':checkbox').each(function () {
                if($('#change_edit_mode').hasClass('btn-danger')){
                    if ($(this).prop('checked')){
                        $(this).prop('checked',false);
                        change_tr_out_edit($(this).parent().parent())
                    }else{
                        $(this).prop('checked',true);
                        change_tr_in_edit($(this).parent().parent())
                    }
                }else{
                    if ($(this).prop('checked')){
                        $(this).prop('checked',false)
                    }else{
                        $(this).prop('checked',true);
                    }
                }
            })
        })
    }
    function bind_cancel_all() {
        $('#cancel_all').click(function () {
            $('#table_td').find(':checked').each(function () {
                if($('#change_edit_mode').hasClass('btn-danger')){
                    $(this).prop('checked',false)
                    change_tr_out_edit($(this).parent().parent())
                }else{
                    $(this).prop('checked',false)
                }
            })
        })
    }
    function bind_edit_button() {
        $('#change_edit_mode').click(function () {
            var edit_flag = $(this).hasClass('btn-info');
            if(edit_flag){
                $(this).removeClass('btn-info').addClass('btn-danger').text('退出编辑模式')
                $('#table_td').find(':checked').each(function () {
                    var cur_tr_obj = $(this).parent().parent();

                    change_tr_in_edit(cur_tr_obj)
                })
            }else{
                $('#table_td').find(':checked').each(function () {
                    var cur_tr_obj = $(this).parent().parent();
                    cur_tr_obj.removeClass('success');
                    change_tr_out_edit(cur_tr_obj)
                });
                $(this).removeClass('btn-danger').addClass('btn-info').text('进入编辑模式')
        }}
        )
        }
    function bind_save_button() {
        $('#save_all').click(function () {
            var post_list = [];
            $('#table_td').find('tr[has_edit="true"]').each(function () {
                var tmp_dict = {};
                tmp_dict['id'] = $(this).attr('row-id');
                $(this).children('[edit_enable="true"]').each(function () {
                    var before_val = $(this).attr('sel_id');
                    var new_val = $(this).attr('new_val');
                    var cur_name = $(this).attr('name');
                    if(before_val != new_val){
                        tmp_dict[cur_name]=new_val
                    }
                });
                post_list.push(tmp_dict);
            });
            $.ajax({
            url: requesturl,
            type:'PUT',
            data:{'post_list':JSON.stringify(post_list)},
            dataType:'JSON',
            success:function (result) {
               if (result.status){
                   init(1)
               }else{
                   alert(result.message)
               }
            }
        })
        })
    }
    function bind_check_box() {
            $('#table_td').on('click',':checkbox',function () {
                if ($('#change_edit_mode').hasClass('btn-danger')) {
                    var ischeck = $(this).prop('checked');
                    var cur_tr_obj = $(this).parent().parent();
                    if (ischeck) {
                        console.log('进入编辑模式');
                        cur_tr_obj.addClass('success');
                        change_tr_in_edit(cur_tr_obj)
                    } else {

                        console.log('退出编辑模式');
                        change_tr_out_edit(cur_tr_obj)
                    }
                }})

    }
    function change_tr_in_edit(cur_tr_obj) {
        cur_tr_obj.addClass('success');
        cur_tr_obj.attr('has_edit','true');
        cur_tr_obj.children().each(function () {
            var edit_enable = $(this).attr('edit_enable');
            var edit_type = $(this).attr('edit_type');

            if(edit_enable=='true'){
                if (edit_type=='select'){
                    var cur_global_name = $(this).attr('global_name');
                    var sel_id = $(this).attr('sel_id');
                    var cur_sel = document.createElement('select');
                    $.each(window[cur_global_name],function (cur_index,cur_val) {
                        var cur_opt = document.createElement('option');
                        cur_opt.setAttribute('value',cur_val[0]);
                        cur_opt.innerText=cur_val[1];
                        cur_sel.append(cur_opt);
                    });

                    $(cur_sel).val(sel_id)
                    var cur_data = cur_sel
                }else if(edit_type=='input'){
                    var in_text = $(this).text();
                    var cur_data = document.createElement('input');
                    cur_data.value = in_text;
                }
                $(cur_data).addClass('form-control');
                $(this).html(cur_data)
            }
        })
    }
    function change_tr_out_edit(cur_tr_obj) {
        cur_tr_obj.removeClass('success');
        cur_tr_obj.children().each(function () {
            var edit_enable = $(this).attr('edit_enable');
            var edit_type = $(this).attr('edit_type');
            if(edit_enable=='true'){
                if (edit_type=='select'){
                    var sel_obj = $(this).children().first();
                    var new_id = sel_obj.val();
                    var in_text = sel_obj[0].selectedOptions[0].innerHTML;
                    $(this).attr('new_val',new_id)
                    $(this).html(in_text);
                }else if(edit_type=='input'){
                var in_text = $(this).children().first().val();
                    $(this).html(in_text);
                    $(this).attr('new_val',in_text)
                }
            }
        })
    }
    function init(pager) {
        $.ajax({
            url: requesturl,
            type:'GET',
            data:{'pager':pager},
            dataType:'JSON',
            success:function (result) {
                init_global_data(result.global_dict);
                init_table_header(result.table_config);
                init_table_body(result.table_config,result.datalist);
                init_pager(result.pager)
            }
        })
    }
    function init_pager(pager) {
        $('#pagination').html(pager)
    }
    function init_table_header(table_config) {
        $('#table_th').empty();
        var tr = document.createElement('tr');
        $.each(table_config,function (k,item) {
            if(item.display){
            var th = document.createElement('th');
            th.innerHTML = item.title;
            $(tr).append(th)}
        });
        $('#table_th').append(tr)
    }
    function init_table_body(config,datalist) {
        $('#table_td').empty();
        $.each(datalist,function (data_index,data) {
            var tr = document.createElement('tr');
            tr.setAttribute('row-id',data['id'])
           $.each(config,function (config_index,config_item) {
               if(config_item.display){
                   var td = document.createElement('td');
                   var kwargs = {};
                   $.each(config_item.text.kwargs,function (key,val) {
                       if(val[0]=='@'){
                           var global_name = val.substring(1,val.length);
                           var cur_id = data[config_item.q];
                           var cur_text = get_value_from_global_by_id(global_name,cur_id);
                           kwargs[key] = cur_text
                       }
                      else if(val[0]=='&'){
                          kwargs[key] = data[val.substring(1,val.length)]
                      }else{
                          kwargs[key] = val
                      }
                   });
                   td.innerHTML = config_item.text.content.format(kwargs);
                   /*th.innerHTML = data[config_item.q];*/
                   $.each(config_item.attrs,function (attr_key,attr) {
                       if (attr[0]=='@'){
                           td.setAttribute(attr_key,data[attr.substring(1,attr.length)]);
                       }else {
                           td.setAttribute(attr_key, attr);
                       }
                   });
                   $(tr).append(td)}
           });
            $('#table_td').append(tr)
        });
    }
    function init_global_data(global_dict) {
        $.each(global_dict,function (k,v) {
            window[k] = v
        })
    }
    function get_value_from_global_by_id(global_name,cur_id) {
        var ret = null
        $.each(window[global_name],function (k,item) {
            if(item[0] == cur_id){
            ret = item[1]
            }
            return
        });
        return ret
    }
    function bind_pager(){
        $('#pagination').on('click','a',function () {
            var num = $(this).text();
            console.log(num);
            init(num)
        })
    }
    jQuery.extend({
        'NB':function (url_str) {
            requesturl = url_str;
            init();
            bind_edit_button();
            bind_check_box();
            bind_check_all();
            bind_reverse_all();
            bind_cancel_all();
            bind_save_button();
            bind_pager();
        },
        'changePage':function (num) {
            init(num)
        }
    });

})();