let current = location.href
        let item = document.querySelectorAll('a.menu')
        let length = item.length
        for (i = 0; i < length; i++) {
            if (item[i].href === current) {
                item[i].className='bg-primary'
            }
        }