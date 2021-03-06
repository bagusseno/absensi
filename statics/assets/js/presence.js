$(document).ready(function() {

    $("#completion-form").parsley()

    $("#cancel-btn").click((e) => {
        
        e.preventDefault()
        
        $("#presence").show();
        $("#register").hide();

        current_selected_audience_id = 0
    })
    
    $("#name").keyup(function() {

        var found_audiences = audiences.filter(row => row.name.includes($("#name").val().toUpperCase())).slice(0, 10)

        $("#result").html("")

        found_audiences.forEach((v,k) => {

            $("#result").append('<li data-id=' + v.id + ' class="list-group-item link-class presence-item-css presence-item">'
                + v.name
                + '<span class="audience-info">' + v.desa + '</span>'
                + '<span class="audience-info">' + v.kelompok + '</span>'
                + '</li>')

            $(".presence-item").click(function() {
                
                current_registration_state = 'update'

                $("#presence").hide();
                $("#register").show();

                var audience = audiences.find(element => element.id == $(this).attr('data-id'))
                current_selected_audience_id = $(this).attr('data-id')

                $("#nama").val(audience.name)
                $("#gender").val(audience['jenis kelamin'])
                $("#desa").val(audience.desa)
                $("#desa").change()
                $("#pendidikan").val(audience['jenjang pendidikan'])
		        $("#pendidikan").change()
                $("#kelas").val(audience['kelas/tingkatan'])
                $("#kelompok").val(audience.kelompok)

                var ttl_moment = moment(audience['tanggal lahir'], 'DD/MM/YYYY')
                var ttl = ttl_moment.toDate()
                
		if(!isNaN(ttl.getDate())) {              
                $('#ttl-tgl').val(ttl.getDate())
                $('#ttl-bulan').val(ttl.getMonth()+1) // getMonth() starts from zero
                $('#ttl-tahun').val(ttl.getFullYear())
		}
            })
        })

        $("#result").prepend('<li id="new-registration" class="list-group-item link-class presence-item-css">'
                + '<font color=green>Belum ada namanya? Klik di sini untuk registrasi! :)</font>'
                + '</li>')
        
        $("#new-registration").click(() => {

            $("#presence").hide();
            $("#register").show();

            current_registration_state = 'register'
        })
    })

    $("#presence-btn").click((e) => {

        e.preventDefault()

        $('#presence-btn').attr('disabled', true)

        var ttl_string = $("#ttl-tgl").val() + '/' + $("#ttl-bulan").val() + '/' + $("#ttl-tahun").val() 
        var ttl_moment = moment(ttl_string, 'DD/MM/YYYY')

        $.ajax({
            url: 'http://localhost:354/admin/api/presence',
            method: 'POST',
            data: {
                registration_state: current_registration_state,
                event_id: event_id,
                audience_id: current_selected_audience_id,
                status: 'present',
                name: $('#nama').val(),
                audience_meta_values: [
                    {
                        audience_meta_index_id: 2,
                        value: $('#gender').val()
                    },
                    {
                        audience_meta_index_id: 3,
                        value: $('#kelompok').val()
                    },
                    {
                        audience_meta_index_id: 4,
                        value: $('#desa').val()
                    },
                    {
                        audience_meta_index_id: 5,
                        value: $('#pendidikan').val()
                    },
                    {
                        audience_meta_index_id: 6,
                        value: $('#kelas').val()
                    },
                    {
                        audience_meta_index_id: 7,
                        value: ttl_string
                    },
                    {
                        audience_meta_index_id: 8,
                        value: ttl_moment.diff(moment(), 'years')
                    },
                ]
            }
        }).done((res) => {
            
            res = JSON.parse(res)

            if(res.status) {

                $("#success-msg").show()
                $("#presence").hide()
                $("#register").hide()

                setTimeout(() => {
                   
                    $("#success-msg").hide()
                    $("#presence").show()
                    $("#register").hide()
                }, 2000)

                $("#nama").val('')
                $("#gender").val('')
                $("#desa").val('')
                $("#desa").val('')
                $("#pendidikan").val('')
                $("#kelas").val('')
                $("#ttl").val('')
                $("#kelompok").val('')

                $("#name").val('')
                $("#result").html('')
                
                current_selected_audience_id = 0
            }

            $("#presence-btn").attr("disabled", false)
            
        }).fail((e) => {

            alert("Terjadi kesalahan. " + e)
            $("#presence-btn").attr("disabled", false)
        })
    })
    
    $("#desa").change(() => {

        $("#kelompok").html("")

        switch($("#desa").val()) {

            case 'BALEENDAH':
                $("#kelompok").append('<option value="CIPBAR">CIPBAR</option>')
                $("#kelompok").append('<option value="CIPTIM">CIPTIM</option>')
                $("#kelompok").append('<option value="KERTAMANAH">KERTAMANAH</option>')
                $("#kelompok").append('<option value="KPM">KPM</option>')
                $("#kelompok").append('<option value="MUNJUL">MUNJUL</option>')
                $("#kelompok").append('<option value="DAYEUHKOLOT">DAYEUHKOLOT</option>')
                $("#kelompok").append('<option value="PALASARI">PALASARI</option>')
                $("#kelompok").append('<option value="PPM">PPM</option>')
                $("#kelompok").append('<option value="MANGGAHANG">MANGGAHANG</option>')
		        $("#kelompok").append('<option value="PONDOK">PONDOK</option>')
                break

            case 'BANJARAN':
                $("#kelompok").append('<option value="CIJULANG"><CIJULANG/option>')
                $("#kelompok").append('<option value="CIMAUNG">CIMAUNG</option>')
                $("#kelompok").append('<option value="NAMBO">NAMBO</option>')
                $("#kelompok").append('<option value="PANGALENGAN">PANGALENGAN</option>')
                $("#kelompok").append('<option value="CIJULANG">CIJULANG</option>')
                break

            case 'CIPARAY':
                $("#kelompok").append('<option value="BARUJATI">BARUJATI</option>')
                $("#kelompok").append('<option value="CIDAWOLONG">CIDAWOLONG</option>')
                $("#kelompok").append('<option value="CIPAKU">CIPAKU</option>')
                $("#kelompok").append('<option value="KBSI">KBSI</option>')
                break
        
            case 'MAJALAYA':
                $("#kelompok").append('<option value="BOJONG">BOJONG</option>')
                $("#kelompok").append('<option value="HAURBUYUT">HAURBUYUT</option>')
                $("#kelompok").append('<option value="MUARA">MUARA</option>')
                $("#kelompok").append('<option value="PONGPORANG">PONGPORANG</option>')
                $("#kelompok").append('<option value="SUKMA 1">SUKMA 1</option>')
                $("#kelompok").append('<option value="SUKMA 2">SUKMA 2</option>')
                $("#kelompok").append('<option value="SUKMA 3">SUKMA 3</option>')
                break

            case 'SAYATI':
                $("#kelompok").append('<option value="BURUJUL">BURUJUL</option>')
                $("#kelompok").append('<option value="CIBADUYUT">CIBADUYUT</option>')
                $("#kelompok").append('<option value="KOPER">KOPER</option>')
                $("#kelompok").append('<option value="MAPER">MAPER</option>')
                $("#kelompok").append('<option value="MARKEN">MARKEN</option>')
                $("#kelompok").append('<option value="PERMAKO">PERMAKO</option>')
                $("#kelompok").append('<option value="TKI">TKI</option>')
                break

            case 'SOREANG':
                $("#kelompok").append('<option value="CIWIDEY">CIWIDEY</option>')
                $("#kelompok").append('<option value="JUNTI">JUNTI</option>')
                $("#kelompok").append('<option value="SOREANG 1">SOREANG 1</option>')
                $("#kelompok").append('<option value="SOREANG 2">SOREANG 2</option>')
                $("#kelompok").append('<option value="WARLOB 1">WARLOB 1</option>')
                $("#kelompok").append('<option value="WARLOB 2">WARLOB 2</option>')
                break
        }
    })

    $("#pendidikan").change(() => {

        $("#kelas").html("")

        switch($("#pendidikan").val()) {

            case 'SMP':
                $("#kelas").append('<option value="7">7</option>')
                $("#kelas").append('<option value="8">8</option>')
                $("#kelas").append('<option value="9">9</option>')
                break

            case 'SMK':
                $("#kelas").append('<option value="10">10</option>')
                $("#kelas").append('<option value="11">11</option>')
                $("#kelas").append('<option value="12">12</option>')
                break

            case 'SMA':
                $("#kelas").append('<option value="10">10</option>')
                $("#kelas").append('<option value="11">11</option>')
                $("#kelas").append('<option value="12">12</option>')
                break
        
            case 'KULIAH':
                $("#kelas").append('<option value="1">1</option>')
                $("#kelas").append('<option value="2">2</option>')
                $("#kelas").append('<option value="3">3</option>')
                $("#kelas").append('<option value="4">4</option>')
                break

            case 'LULUS/KERJA':
                $("#kelas").append('<option value="LULUS/KERJA">LULUS/KERJA</option>')
                break
        }
    })
})