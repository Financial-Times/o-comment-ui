{{#selects}}
    <label for="{{name}}" class="inline" style="width: 75%;">{{label}}</label>
    <select name="{{name}}" id="{{name}}" class="inline" style="width: 25%;">
        {{#options}}
            <option value="{{val}}" {{#selected}}selected="selected"{{/selected}}>{{label}}</option>
        {{/options}}
    </select>
    <div class="clear"></div>
{{/selects}}

<br/>

{{#checkboxes}}
    <label for="{{name}}" class="inline" style="width: 75%">{{label}}</label>
    <input type="checkbox" name="{{name}}" id="{{name}}" {{#checked}}checked="checked"{{/checked}}>
{{/checkboxes}}