<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
</head>

<body>
@if(isset($data) && is_array($data) && count($data) > 0)
        @foreach($data as $item)
            @if(!$item['is_ftp'])
                <label>Ģeoprodukta nosaukums: </label>{{$item['name']}} <br/>
                <label>Datu Izplatīšanas veids: </label>{{$item['type']}} <br/>
                <label>Pārbaude veikta: </label>{{$item['time']}} <br/>
                <label>Pārbaude, kas nav izieta: </label>{{$item['error']}} <br/>
                <label>Ģeoprodukta URL </label>{{$item['url']}} <br/>
                <label>Datu turētājs: </label>{{$item['data_holder']}} <br/>
            @else
                <label>Neizdevās atjaunot FTP datnes, ģeoproduktam ar ID: {{$item['id']}} <br/>
                <label>Laiks: </label>{{$item['time']}} <br/>
                <label>Ģeoprodukta nosaukums: </label>{{$item['name']}} <br/>
                <label>Ftp adrese: </label>{{$item['type']}} <br/>
                <label>Ģeoprodukta URL </label>{{$item['url']}} <br/>
                <label>Datu turētājs: </label>{{$item['data_holder']}} <br/>
            @endif
                <br/> <br/>
        @endforeach
@endif
</body>
</html>
