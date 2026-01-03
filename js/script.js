  const API_URL = "https://script.google.com/macros/s/AKfycby4n6AtlX6OBFGUrjQ2yh8Nfg6jk-ZmLNHsGZyblvAsQL18rJ5BEGopb_qdSL65PW3ZTA/exec";

  
        let user = null;
        let dataStore = { data1: [], data2: [], photos: [] };
        let activeSheet = 'data1';
        let currentStatus = 'all';
        let currentSlide = 0;

        window.onload = async () => {
            const saved = localStorage.getItem('banhom_session');
            if(saved) {
                user = JSON.parse(saved);
                document.getElementById('loginPage').classList.add('hidden-el');
                document.getElementById('mainUI').classList.remove('hidden-el');
                // updateProfileUI();
                // await refreshData();
                // switchTab('home');
                initApp();
            }
        };



        async function initApp() {
            document.getElementById('loginPage').classList.add('hidden-el');
            document.getElementById('mainUI').classList.remove('hidden-el');
            updateProfileUI();
            await refreshData(false);
            switchTab('home');
            // Auto Sync ข้อมูลทุก 10 วินาที
            setInterval(() => refreshData(true), 10000);
        }

        async function api(action, params = {}, showLoad = true) {
    if (showLoad) showLoading(true); // แสดงโหลดเฉพาะเมื่อต้องการ
    try {
        const qs = new URLSearchParams({ action, ...params }).toString();
        const res = await fetch(`${API_URL}?${qs}`);
        const json = await res.json();
        if (showLoad) showLoading(false);
        return json;
    } catch (e) {
        if (showLoad) showLoading(false);
        return null;
    }
}





        // async function api(action, params = {}) {
        //     try {
        //         const qs = new URLSearchParams({ action, ...params }).toString();
        //         const res = await fetch(`${API_URL}?${qs}`);
        //         return await res.json();
        //     } catch (e) { return null; }
        // }

        
       

          function showLoading(show) {
            const overlay = document.getElementById('loadingOverlay');

              if(show) {
                overlay.classList.remove('hidden-el');
                simulateProgress();
            } else {
                overlay.classList.add('hidden-el');
            }




            // if(show) overlay.classList.remove('hidden-el');
            // else overlay.classList.add('hidden-el');
        }
        





      async function initApp() {
    document.getElementById('loginPage').classList.add('hidden-el');
    document.getElementById('mainUI').classList.remove('hidden-el');
    updateProfileUI();
    
    // โหลดครั้งแรกให้แสดง Loading (ส่ง false)
    await refreshData(false);
    
    switchTab('home');

    // Auto Sync ทุก 10 วินาที ไม่ต้องแสดง Loading (ส่ง true)
    setInterval(() => refreshData(true), 10000); 
}
      


    async function refreshData(silent = false) {
    const result = await api('fetchAll', {}, !silent); 
    if(result) {
        dataStore = result;
        renderHome();
        if(!document.getElementById('tab-logistics').classList.contains('hidden-el')) {
            renderLogisticsList();
        }
    }
}

        async function handleLogin() {
            const phone = document.getElementById('loginPhone').value;
            const pass = document.getElementById('loginPassword').value;
            if(phone.length !== 8) return Swal.fire({
                title: "ກະລຸນາໃສ່ເບີໂທແລະລະຫັດຜ່ານ",
                text: "ເບີໂທຄວນໃສ່ 8 ຕົວເລກ",
                icon: "question",
                timer: 5000
});

            const res = await api('login', { phone, pass });
            if(res.status === 'success') {
                if(res.user.status === 'new') {
                    user = res.user;
                    document.getElementById('loginPage').classList.add('hidden-el');
                    document.getElementById('newPasswordPage').classList.remove('hidden-el');
                     initApp();
                } else {
                    completeLogin(res.user);
                }
            } else {
                // alert(res.message);
                  Swal.fire({
                  icon: "error",
                  title: "ເບີໂທຫຼືລະຫັດຜ່ານບໍ່ຖືກ",
                  text: "ກະລຸນາໃສ່ລະຫັດຜ່ານໃຫ້ຖືກຕ້ອງ",
                  });
            }
        }

      async function confirmNewPassword() {
    const p1 = document.getElementById('newPass1').value;
    const p2 = document.getElementById('newPass2').value;

    if(p1 === "" || p2 === "") return Swal.fire({
          icon: "error",
          title: "ບໍ່ທັນໃສ່ລະຫັດຜ່ານ",
          text: "ກະລຸນາໃສ່ລະຫັດຜ່ານກ່ອນເຂົ້າລະບົບ",
    });

    if(p1.length < 5) return Swal.fire({ // ປ່ຽນເປັນ 5 ຕາມທີ່ text ບອກ
          icon: "error",
          title: "ລະຫັດຜ່ານສັ້ນເກີນໄປ",
          text: "ກະລຸນາໃສ່ລະຫັດຜ່ານຢ່າງນ້ອຍ 5 ຕົວເລກ",
    });

    // --- ເພີ່ມສ່ວນກວດສອບເລກລຽງ ຫຼື ເລກຊ້ຳ ---
    const commonPatterns = ["12345", "123456", "12345678", "123456789", "012345", "54321", "00000", "11111"];
    if (commonPatterns.some(pattern => p1.includes(pattern))) {
        return Swal.fire({
            icon: "warning",
            title: "ລະຫັດຜ່ານເດົາງ່າຍເກີນໄປ",
            text: "ກະລຸນາຢ່າໃຊ້ເລກລຽງ ຫຼື ເລກຊ້ຳກັນ (ຕົວຢ່າງ: 12345)",
        });
    }
    // ------------------------------------

    if(p1 !== p2) return Swal.fire({
          icon: "error",
          title: "ລະຫັດຜ່ານບໍ່ຕົງກັນ",
          text: "ກະລຸນາໃສ່ລະຫັດຜ່ານຫ້ອງທີ 1 ແລະ 2 ໃຫ້ຄືກັນ",
    });

    const res = await api('updatePassword', { phone: user.phone, newPass: p1, isNew: 'true' });
    if(res.status === 'success') {
        user.status = 'Changed';
        completeLogin(user);
    }
}


        function completeLogin(userData) {
            user = userData;
            localStorage.setItem('banhom_session', JSON.stringify(user));
            document.getElementById('loginPage').classList.add('hidden-el');
            document.getElementById('newPasswordPage').classList.add('hidden-el');
            document.getElementById('mainUI').classList.remove('hidden-el');
            updateProfileUI();
            refreshData();
            api('logLogin', { phone: user.phone });

        }

        function logout() {
        

            localStorage.removeItem('banhom_session');
            location.reload();
        }


         async function openUpdateName() {
    // 1. ตรวจสอบว่า Login หรือยัง
    if (!user || !user.phone) {
        return Swal.fire('ກະລຸນາເຂົ້າສູ່ລະບົບ', '', 'error');
    }

    // 2. แสดง SweetAlert2 พร้อมช่องกรอกข้อความ (Input)
    const { value: newName } = await Swal.fire({
        title: 'ແກ້ໄຂຊື່ຜູ້ໃຊ້ງານ',
        input: 'text',
        inputLabel: 'ກະລຸນາເພີ່ມຊື້ໃໝ່ຂອງທ່ານ',
        inputValue: user.name || '', // แสดงชื่อปัจจุบันเป็นค่าเริ่มต้น
        showCancelButton: true,
        confirmButtonText: 'บບັກທຶກ',
        cancelButtonText: 'ຍົກເລີກ',
        inputPlaceholder: 'ຕົວຢ່າງ: BanhomDev',
        confirmButtonColor: '#2563eb',
        customClass: {
            popup: 'rounded-[2rem]',
            input: 'rounded-xl'
        },
        inputValidator: (value) => {
            if (!value) return 'ກະລຸນາໃສ່ຊື່ກ່ອນບັນທຶກ!';
            if (value.length < 2) return 'ຊື່ສັ້ນເກີນໄປ!';
        }
    });

    // 3. หากผู้ใช้กดบันทึก (มีค่า newName ส่งมา)
    if (newName) {
        try {
            // แสดง Loading ระหว่างรอ Server
            document.getElementById('loadingOverlay').classList.remove('hidden-el');

            // ส่งข้อมูลไปที่ Google Apps Script (Action: updateProfile)
            const qs = new URLSearchParams({
                action: 'updateProfile',
                phone: user.phone,
                newName: newName.trim()
            }).toString();

            const res = await fetch(`${API_URL}?${qs}`);
            const result = await res.json();

            document.getElementById('loadingOverlay').classList.add('hidden-el');

            if (result.status === 'success') {
                // อัปเดตข้อมูลในเครื่อง (LocalStorage & Variable)
                user = result.user;
                localStorage.setItem('banhom_session', JSON.stringify(user));
                
                // อัปเดต UI หน้าจอ
                updateProfileUI(); 

                // แจ้งเตือนสำเร็จ
                    MySwal.fire({
                        icon: 'success',
                        title: 'ແກ້ໄຂສຳເລັດ',
                        text: 'ຊື່ຜູ້ໃຊ້ຖືກປ່ຽນແປງຮຽບຮ້ອຍ',
                        timer: 2500,
                        showConfirmButton: false
                    });
                } else {
                    MySwal.fire('ບໍ່ສຳເລັດ', 'ບໍ່ສາມາດແກ້ໄຂຂໍ້ມູນໄດ້ຕອນນີ້', 'error');
                }
        } catch (error) {
            document.getElementById('loadingOverlay').classList.add('hidden-el');
            Swal.fire('ເກີດຂໍ້ຜິດພາດ', 'ບໍ່ສາມາດເຊື່ອມຕໍ່ Server ໄດ້', 'error');
        }
    }
}






async function openUpdatePass() {
    // 1. ตรวจสอบว่าล็อกอินหรือยัง
    if (!user || !user.phone) {
        return Swal.fire('ກະລຸນາເຂົ້າສູ່ລະບົບ', '', 'error');
    }

    // 2. เปิด Popup รับค่ารหัสผ่านใหม่
    const { value: newPassword } = await Swal.fire({
        title: 'ປ່ຽນລະຫັດຜ່ານໃໝ່!',
        input: 'password',
        inputLabel: 'ກະລຸນາໃສ່ລະຫັດຜ່ານທີ່ຕ້ອງການ',
        inputPlaceholder: 'ລະຫັດຜ່ານຢ່າງນ້ອຍ 4 ຕົວເລກ',
        showCancelButton: true,
        confirmButtonText: 'ຢືນຢັນປ່ຽນ',
        cancelButtonText: 'ຍົກເລີກ',
        confirmButtonColor: '#2563eb', // สีน้ำเงิน
        inputAttributes: {
            autocapitalize: 'off',
            autocorrect: 'off'
        },
        customClass: {
            popup: 'rounded-[2.5rem]',
            confirmButton: 'rounded-xl px-8 py-3',
            cancelButton: 'rounded-xl px-8 py-3'
        },
        // ตรวจสอบความถูกต้องเบื้องต้นก่อนส่ง
        inputValidator: (value) => {
            if (!value) return 'ຍັງບໍ່ທັນໃສ່ຂໍ້ມູນລະຫັດຜ່ານ';
            if (value.length < 4) return 'ລະຫັດຜ່ານຕ້ອງມີຢ່າງນ້ອຍ 4 ຕົວ';
        }
    });

    // 3. หากผู้ใช้กรอกข้อมูลและกดยืนยัน
    if (newPassword) {
        // แสดง Loading ขณะบันทึก
        document.getElementById('loadingOverlay').classList.remove('hidden-el');

        try {
            // ส่งข้อมูลไปที่ Google Apps Script
            const params = new URLSearchParams({
                action: 'updateProfile',
                phone: user.phone,
                newPass: newPassword
            }).toString();

            const response = await fetch(`${API_URL}?${params}`);
            const result = await response.json();

            document.getElementById('loadingOverlay').classList.add('hidden-el');

            if (result.status === 'success') {
                // อัปเดตข้อมูลในเครื่อง (LocalStorage)
                user.password = newPassword;
                localStorage.setItem('banhom_session', JSON.stringify(user));

                Swal.fire({
                    icon: 'success',
                    title: 'ປ່ຽນລະຫັດສຳເລັດ!',
                    text: 'ກະລຸນາຈື່ລະຫັດຜ່ານໃໝ່ຂອງທ່ານເພື່ອ Login ຄັ້ງຕໍ່ໄປ',
                    timer: 3000,
                    showConfirmButton: false
                });
            } else {
                Swal.fire('ເີກດຂໍ້ຜິດພາດ', result.message || 'ບໍ່ສາມາດເຊື່ອມຕໍ່ Server ໄດ້', 'error');
            }
        } catch (error) {
            document.getElementById('loadingOverlay').classList.add('hidden-el');
            Swal.fire('Error', 'ບໍ່ສາມາດເຊື່ອມຕໍ່ Server ໄດ້', 'error');
        }
    }
}



        







        // function switchTab(tab) {
        //     document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden-el'));
        //     document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('text-blue-600'));
            
        //     if(tab === 'home') {
        //         document.getElementById('tab-home').classList.remove('hidden-el');
        //         document.querySelector('.nav-item:nth-child(1)').classList.add('text-blue-600');
        //     } else if(tab === 'thailao' || tab === 'chinalao') {
        //         activeSheet = tab === 'thailao' ? 'data1' : 'data2';
        //         currentStatus = 'ທັງໝົດ';
        //         document.getElementById('logTitle').innerText = tab === 'thailao' ? 'ລາຍການ ໄທ-ລາວ' : 'ລາຍການ ຈີນ-ລາວ';
        //         document.getElementById('tab-logistics').classList.remove('hidden-el');
        //         const idx = tab === 'thailao' ? 2 : 4;
        //         document.querySelector(`.nav-item:nth-child(${idx})`).classList.add('text-blue-600');
        //         renderLogisticsList();
        //     } else if(tab === 'profile') {
        //         document.getElementById('tab-profile').classList.remove('hidden-el');
        //         document.querySelector('.nav-item:nth-child(5)').classList.add('text-blue-600');
        //     }
        // }

        //count 0-100
function simulateProgress() {
            let p = 0;
            const label = document.getElementById('progressLabel');
            const interval = setInterval(() => {
                p += Math.floor(Math.random() * 20);
                if(p >= 100) {
                    label.innerText = "100%";
                    clearInterval(interval);
                } else {
                    label.innerText = p + "%";
                }
            }, 100);
        }

        function closeModal(id) {
            document.getElementById(id).classList.add('hidden-el');
        }

        function formatDrive(url) {
            if(!url || !url.includes('drive.google.com')) return null;
            const id = url.match(/[-\w]{25,}/);
            return id ? `https://lh3.googleusercontent.com/d/${id[0]}` : null;
        }

        function previewImg(url) {
            const src = formatDrive(url);
            if(!src) return;
            document.getElementById('previewImgEl').src = src;
            document.getElementById('imgPreviewModal').classList.remove('hidden-el');
        }




//Functio Slider ແລະ ດຶ້ງຂໍ້ມູນມາສະແດງ

                //           function renderHome() {
                //       // 1. Update Statistics (Thai & China Data)
                //       const myThai = dataStore.data1.filter(d => d.phone == user.phone);
                //       const myChina = dataStore.data2.filter(d => d.phone == user.phone);
                      
                //       const statThaiEl = document.getElementById('statThai');
                //       const statChinaEl = document.getElementById('statChina');
                      
                //       if (statThaiEl) statThaiEl.innerText = myThai.length;
                //       if (statChinaEl) statChinaEl.innerText = myChina.length;

                //       // 2. Setup Slider Elements
                //       const slider = document.getElementById('photoSlider');
                //       const dots = document.getElementById('sliderDots');
                //       if (!slider || !dots) return;

                //       // 3. Filter Photo Data
                //       const photoList = (dataStore.photos || []).filter(p => {
                //           const link = p.url || p.image || p.link || p.photo;
                //           return link && link.toString().trim() !== "";
                //       });

                //       // 4. Handle Empty Photo State
                //       if (photoList.length === 0) {
                //           slider.innerHTML = `<div class="bg-gray-100 w-full h-full flex items-center justify-center">ບໍ່ມີຮູບ</div>`;
                //           dots.innerHTML = '';
                //           return;
                //       }

                //       // 5. Render Slider Images
                //       slider.innerHTML = photoList.map(p => {
                //           const src = formatDrive(p.url || p.image || p.link || p.photo);
                //           return `<div class="slider-item"><img src="${src}"></div>`;
                //       }).join('');

                //       // 6. Render Dots
                //       dots.innerHTML = photoList.map(() => 
                //           `<div class="dot-item w-2 h-2 rounded-full bg-white/40 transition-all"></div>`
                //       ).join('');
                      
                //       // 7. Manage Auto-slide Timer
                //       if (typeof sliderInterval !== 'undefined') clearInterval(sliderInterval);
                      
                //       sliderInterval = setInterval(() => {
                //           currentSlide = (currentSlide + 1) % photoList.length;
                //           updateSliderUI();
                //       }, 5000); 
                      
                //       // Initial UI Update
                //       updateSliderUI(); 
                //   }

                //   // Keep this function separate for reuse by the interval
                //   function updateSliderUI() {
                //       const slider = document.getElementById('photoSlider');
                //       if (slider) slider.style.transform = `translateX(-${currentSlide * 100}%)`;
                      
                //       const dots = document.querySelectorAll('#sliderDots .dot-item .dot-shape');
                //       dots.forEach((d, i) => {
                //           if (i === currentSlide) {
                //               d.classList.add('bg-white', 'w-6');
                //               d.classList.remove('bg-white/40');
                //           } else {
                //               d.classList.remove('bg-white', 'w-6');
                //               d.classList.add('bg-white/40');
                //           }
                //       });
                //   }

// ປະກາດຕົວແປໄວ້ຂ້າງນອກເພື່ອໃຫ້ທຸກຟັງຊັນໃຊ້ຮ່ວມກັນໄດ້
// let currentSlide = 0;
let sliderInterval;
let startX = 0;

function renderHome() {
    // --- 1. Update ສະຖິຕິ (ໄທ ແລະ ຈີນ) ---
    // ກວດສອບກ່ອນວ່າ dataStore ແລະ user ມີຂໍ້ມູນແທ້ຫຼືບໍ່
    if (dataStore && user && user.phone) {
        const myThai = (dataStore.data1 || []).filter(d => d.phone == user.phone);
        const myChina = (dataStore.data2 || []).filter(d => d.phone == user.phone);
        
        const statThaiEl = document.getElementById('statThai');
        const statChinaEl = document.getElementById('statChina');
        
        if (statThaiEl) statThaiEl.innerText = myThai.length;
        if (statChinaEl) statChinaEl.innerText = myChina.length;
    }

    // --- 2. ຈັດການ Slider ---
    const slider = document.getElementById('photoSlider');
    const dots = document.getElementById('sliderDots');
    if (!slider || !dots) return;

    const photoList = (dataStore.photos || []).filter(p => {
        const link = p.url || p.image || p.link || p.photo;
        return link && link.toString().trim() !== "";
    });

    if (photoList.length === 0) {
        slider.innerHTML = `<div class="w-full h-full flex items-center justify-center">ບໍ່ມີຮູບ</div>`;
        return;
    }

    // Render ຮູບ ແລະ ເພີ່ມ Link ໄປ Facebook
    slider.innerHTML = photoList.map(p => {
        const src = formatDrive(p.url || p.image || p.link || p.photo);
        const fbLink = p.facebookUrl || ""; // ປ່ຽນຕາມ Key ຂອງທ່ານ
        return `
            <div class="slider-item">
            <img src="${src}">
        </div>`;
    }).join('');

    // Render Dots
    dots.innerHTML = photoList.map(() => 
        `<div class="dot-item w-2 h-2 rounded-full bg-white/40 transition-all"></div>`
    ).join('');

    // ເລີ່ມຕົ້ນລະບົບປັດ (Swipe)
    initSwipe(slider, photoList.length);

    // ເລີ່ມ Auto Slide
    startAutoSlide(photoList.length);
    
    updateSliderUI(); 
}

function initSwipe(slider, length) {
    // ສຳລັບມືຖື
    slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        clearInterval(sliderInterval);
    }, {passive: true});

    slider.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        handleGesture(startX, endX, length);
        startAutoSlide(length);
    }, {passive: true});

    // ສຳລັບຄອມ (Mouse)
    slider.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        clearInterval(sliderInterval);
    });

    slider.addEventListener('mouseup', (e) => {
        const endX = e.clientX;
        handleGesture(startX, endX, length);
        startAutoSlide(length);
    });
}

function handleGesture(sX, eX, length) {
    const diff = sX - eX;
    if (Math.abs(diff) > 50) { // ຖ້າປັດເກີນ 50px
        if (diff > 0) {
            currentSlide = (currentSlide + 1) % length; // ປັດຊ້າຍ -> ໄປໜ້າ
        } else {
            currentSlide = (currentSlide - 1 + length) % length; // ປັດຂວາ -> ກັບຫຼັງ
        }
        updateSliderUI();
    }
}

function startAutoSlide(length) {
    if (sliderInterval) clearInterval(sliderInterval);
    sliderInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % length;
        updateSliderUI();
    }, 5000);
}

function updateSliderUI() {
    const slider = document.getElementById('photoSlider');
    if (!slider) return;
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    const dots = document.querySelectorAll('#sliderDots .dot-item');
    dots.forEach((dot, i) => {
        if (i === currentSlide) {
            dot.className = 'dot-item w-6 h-2 rounded-full bg-white transition-all';
        } else {
            dot.className = 'dot-item w-2 h-2 rounded-full bg-white/40 transition-all';
        }
    });
}



//Functio Slider ແລະ ດຶ້ງຂໍ້ມູນມາສະແດງ

                  


         function calculateDaysArrived(dateArrived) {
            if(!dateArrived) return 0;
            const arrived = new Date(dateArrived);
            if(isNaN(arrived.getTime())) return 0;
            const now = new Date();
            const diffTime = Math.abs(now - arrived);
            return Math.floor(diffTime / (1000 * 60 * 60 * 24));
        }

        function filterByStatus(status) {
            currentStatus = status;
            renderLogisticsList();
        }

        function renderLogisticsList() {
            const list = document.getElementById('logisticsList');
            let myData = dataStore[activeSheet].filter(d => d.phone == user.phone);
            
    // --- ส่วนที่แก้ไข: เรียงลำดับตามวันที่สั่งซื้อล่าสุดก่อน (Descending Order) ---
    myData.sort((a, b) => {
        // สร้าง Date Object และดึงค่า Time (ms) ออกมาเปรียบเทียบ
        const dateA = a.date_ordered ? new Date(a.date_ordered).getTime() : 0;
        const dateB = b.date_ordered ? new Date(b.date_ordered).getTime() : 0;
        
        // เรียงจากมากไปน้อย (B - A) เพื่อให้วันที่ใหม่กว่า (ค่าตัวเลขมากกว่า) ขึ้นก่อน
        return dateB - dateA;
    });
    // ----------------------------------------------------------------------
            const counts = {
                all: myData.length,
                ship: myData.filter(d => d.status === 'ກຳລັງຈັດສົ່ງ').length,
                dest: myData.filter(d => d.status === 'ຮອດປາຍທາງແລ້ວ').length,
                done: myData.filter(d => d.status === 'ສຳເລັດ').length
            };

            document.getElementById('btn-all').innerText = `ທັງໝົດ (${counts.all})`;
            document.getElementById('btn-ship').innerText = `ກຳລັງຈັດສົ່ງ (${counts.ship})`;
            document.getElementById('btn-dest').innerText = `ຮອດປາຍທາງແລ້ວ (${counts.dest})`;
            document.getElementById('btn-done').innerText = `ສຳເລັດ (${counts.done})`;

            document.querySelectorAll('.status-btn').forEach(b => b.classList.remove('status-badge-active'));
            const btnMap = { 'ທັງໝົດ': 'btn-all', 'ກຳລັງຈັດສົ່ງ': 'btn-ship', 'ຮອດປາຍທາງແລ້ວ': 'btn-dest', 'ສຳເລັດ': 'btn-done' };
            document.getElementById(btnMap[currentStatus]).classList.add('status-badge-active');

            const filtered = currentStatus === 'ທັງໝົດ' ? myData : myData.filter(d => d.status === currentStatus);

            if(filtered.length === 0) {
                list.innerHTML = `<div class="text-center py-10 text-gray-400 text-sm">ບໍ່ທັນມີຂໍ້ມູນສັ່ງເຄື່ອງ</div>`;
                return;
            }

            list.innerHTML = filtered.map(item => {
                const imgSrc = formatDrive(item.img);
                const daysAtDest = calculateDaysArrived(item.date_arrived);

                return `
                    <div onclick="showDetail('${item.tracking}')" class="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4 active:scale-[0.98] transition-all">
                        <div class="w-16 h-16 bg-gray-50 rounded-2xl flex-shrink-0 overflow-hidden border border-gray-100 flex items-center justify-center">
                            ${imgSrc ? `<img src="${imgSrc}" class="w-full h-full object-cover">` : `<i class="fas fa-image text-gray-300"></i>`}
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex justify-between items-start mb-1">
                                <h4 class="text-xs font-bold text-blue-600 truncate mr-2">${item.tracking}</h4>
                                <span class="text-[9px] px-2 py-0.5 rounded-full font-bold whitespace-nowrap ${statusStyle(item.status)}"> ${item.status}</span>
                            </div>
                            <p class="text-sm font-semibold text-gray-800 truncate">ສິນຄ້າ: ${item.product || 'ບໍ່ລະບຸຊື່ສິນຄ້າ'}</p>
                            ${item.status !== 'ສຳເລັດ' ? `<p class="text-[10px] text-orange-400 truncate mt-1"> ${item.detail}</p>` : ''}
                          ${item.status === 'ສຳເລັດ'? `<p class="text-[10px] text-green-500 truncate mt-1">ສຳເລັດ ${formatDateOnly(item.date_success)}</p>` 
                                : item.status !== 'ສຳເລັດ' 
                                    ? `<p class="text-[10px] text-gray-400 truncate mt-1">ສັ່ງຊື້ ${formatDateOnly(item.date_ordered)}</p>` 
                                    : `<p class="text-[10px] text-red-400 truncate mt-1">ສະຖານະອື່ນໆ</p>`
                            }
                           
                         ${item.status === 'ຮອດປາຍທາງແລ້ວ' ? `<span class="text-[9px] px-2 py-0.5 rounded-full font-bold whitespace-nowrap ${statusStyle(daysAtDest)}"> ຮອດແລ້ວ ${daysAtDest} ວັນ</span>` : ''}




                        </div>
                    </div>
                `;
            }).join('');
        }

        function statusStyle(s) {
            if(s === 'ສຳເລັດ') return 'bg-green-100 text-green-600';
            if(s === 'ກຳລັງຈັດສົ່ງ') return 'bg-red-100 text-red-600';
            if(s === 'ຮອດປາຍທາງແລ້ວ') return 'bg-orange-100 text-orange-600';
            return 'bg-orange-100 text-orange-600';
        }

        function showDetail(tracking) {
            const item = dataStore[activeSheet].find(d => d.tracking === tracking);
            const body = document.getElementById('detailBody');
            const imgSrc = formatDrive(item.img);
            
            const timelineSteps = [
                { id: 'O', label: 'ຮັບສິນຄ້າສຳເລັດ', date: item.date_success, icon: 'fa-circle-check', color: 'text-green-500' },
                { id: 'N', label: 'ສິນຄ້າຮອດປາຍທາງແລ້ວສາມາດຮັບເຄື່ອງໄດ້ເລີຍ', date: item.date_arrived, icon: 'fa-box-open', color: 'text-orange-500' },
                { id: 'M', label: 'ສິນຄ້າຮອດສູນຄັດແຍກນະຄອນຫຼວງ ກຳລັງຈັດສົ່ງໄປສາຂາປາຍທາງ', date: item.date_transit, icon: 'fa-truck-arrow-right', color: 'text-blue-500' },
                { id: 'L', label: 'ຮັບເຄື່ອງແລ້ວ ກຳລັງຈັດສົ່ງໄປລາວ', date: item.date_received_sys, icon: 'fa-barcode', color: 'text-blue-400' },
                { id: 'K', label: 'ກຳລັງຈັດສົ່ງໃນປະເທດຕົ້ນທາງ', date: item.date_shipping_origin, icon: 'fa-plane-up', color: 'text-indigo-400' },
                { id: 'J', label: 'ສັ່ງຊື້ສຳເລັດ', date: item.date_ordered, icon: 'fa-cart-shopping', color: 'text-blue-400' }
            ];

            const timelineHtml = timelineSteps.map(step => {
                if(!step.date) return '';
                return `
                    <div class="flex gap-4 group">
                        <div class="flex flex-col items-center">
                            <div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center ${step.color} shadow-sm border border-gray-100">
                                <i class="fas ${step.icon} text-sm"></i>
                            </div>
                            <div class="w-0.5 h-10 bg-gray-100 group-last:hidden"></div>
                        </div>
                        <div class="pt-1">
                            <p class="text-sm font-bold text-gray-700">${step.label}</p>
                            <p class="text-[11px] text-gray-400">${formatDateOnly(step.date)}</p>
                        </div>
                    </div>
                `;
            }).join('');

            body.innerHTML = `
                <!-- รูปภาพสินค้าแบบเต็มความกว้าง -->
                <div class="detail-img-container bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 flex items-center justify-center">
                    ${imgSrc ? 
                        `<img src="${imgSrc}" onclick="previewImg('${item.img}')" class="w-full h-full object-contain cursor-zoom-in">` : 
                        `<div class="flex flex-col items-center py-20 text-gray-400">
                            <i class="fas fa-file-image text-5xl mb-3"></i>
                            <p class="text-sm font-medium">ບໍ່ທັນໄດ້ບິນຮັບເຄື່ອງເທື່ອ</p>
                        </div>`
                    }
                </div>

                <!-- ข้อมูลสรุป -->
                <div class="space-y-4 pt-2">
                    <div class="p-5 bg-blue-50/50 rounded-3xl border border-blue-100">
                        <p class="text-[10px] text-blue-400 uppercase font-bold tracking-widest mb-1">ເລກ Tracking</p>
                        <p class="text-2xl font-bold text-blue-600 tracking-tight">${item.tracking}</p>
                    </div>

                    <div class="grid grid-cols-1 gap-3">
                        <div class="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <p class="text-[10px] text-gray-400 font-bold mb-1">ຊື່ສິນຄ້າ</p>
                            <p class="text-sm font-semibold text-gray-800">${item.product || '-'}</p>
                        </div>
                        <div class="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <p class="text-[10px] text-gray-400 font-bold mb-1">ລາຍລະອຽດຈັດສົ່ງ</p>
                            <p class="text-sm font-semibold text-gray-800">${item.detail || '-'}</p>
                        </div>
                    </div>
                </div>

                <!-- Timeline -->
                <div class="pt-6 border-t border-gray-100">
                    <h4 class="text-sm font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <i class="fas fa-route text-blue-500"></i>ສະຖານະຕິດຕາມ
                    </h4>
                    <div class="space-y-0">
                        ${timelineHtml || '<p class="text-center text-gray-400 text-xs py-4">ຍັງບໍ່ມີສະຖານະອັບເດດ</p>'}
                    </div>
                </div>

           

                ${item.status == 'ຮອດປາຍທາງແລ້ວ' ? `
                    <button onclick="confirmReceived('${item.tracking}')" class="w-full py-5 bg-blue-600 text-white rounded-3xl font-bold text-lg shadow-xl shadow-green-100 active:scale-95 transition-all mt-4">
                        <i class="fas fa-check-circle mr-2"></i>ຢືນຢັນຮັບສິນຄ້າ
                    </button>
                ` : ''}
            `;
            document.getElementById('detailModal').classList.remove('hidden-el');
        }
        
        async function confirmReceived(tracking) {
    // 1. Show the SweetAlert confirmation dialog
    const result = await Swal.fire({
        title: 'ຢືນຢັນຮັບສິນຄ້າ?',
        text: "ຖ້າທ່ານໄດ້ຮັບແລ້ວ ລົບກວນກົດທີ່ຢືນຢັນ",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#1E61ED',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ຮັບແລ້ວ',
        cancelButtonText: 'ຍົກເລີກ'
    });

    // 2. Check if the user clicked "Confirm"
    if (result.isConfirmed) {
        const res = await api('markSuccess', { sheet: activeSheet, tracking: tracking });

        if (res.status === 'success') {
            // 3. Show a success message
            await Swal.fire({
                title: 'ສຳເລັດ!',
                text: 'ຮັບສິນຄ້າສຳເລັດແລ້ວ',
                icon: 'success',
                timer: 2000, // Auto close after 2 seconds
                showConfirmButton: false
            });

            closeModal('detailModal');
            await refreshData();
            renderLogisticsList();
        } else {
            // Optional: Handle error
            Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้', 'error');
        }
    }
}    




//.................................................................................................................


        function updateProfileUI() {
 
            document.getElementById('userNameDisplay').innerText = user.name;
            document.getElementById('userPhoneDisplay').innerText = user.phone;
        }

        // function formatDateOnly(dStr) {
        //     if(!dStr) return '-';
        //     try {
        //         const d = new Date(dStr);
        //         if(isNaN(d.getTime())) return dStr;
        //         // รูปแบบ dd/mm/yyyy
        //         const day = String(d.getDate()).padStart(2, '0');
        //         const month = String(d.getMonth() + 1).padStart(2, '0');
        //         const year = d.getFullYear() + 543; // พ.ศ.
        //         return `${day}/${month}/${year}`;
        //     } catch(e) { return dStr; }
        // }

        function formatDateOnly(dStr) {
    if(!dStr) return '-';
    try {
        const d = new Date(dStr);
        if(isNaN(d.getTime())) return dStr;

        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear(); // ปี พ.ศ.
        // const year = d.getFullYear() + 543; // ปี พ.ศ.
        
        // เพิ่มส่วนของเวลา
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');

        return `ວັນທີ ${day}/${month}/${year}  ເວລາ ${hours}:${minutes}`;
    } catch(e) { 
        return dStr; 
    }
}

        function togglePassword(id) {
            const input = document.getElementById(id);
            input.type = input.type === 'password' ? 'text' : 'password';
        }
        


        
        // Profile Modals
        function openEditNameModal() {
            const modal = document.getElementById('inputModal');
            document.getElementById('modalTitle').innerText = "ແກ້ໄຂຊື່ຜູ້ໃຊ້";
            const content = document.getElementById('modalContent');
            content.innerHTML = `<input type="text" id="newNameInput" value="${user.name || ''}" class="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="ระบุชื่อของคุณ">`;
            
            const btn = document.getElementById('modalConfirmBtn');
            btn.onclick = async () => {
                const val = document.getElementById('newNameInput').value;
                

                // 1. Check if the value is empty
    if (val === "") {
        // Optional: Alert the user that the name cannot be empty
        Swal.fire({
            title: 'ບໍ່ທັນໃສ່ຊື່່!',
            text: 'ກະລຸນາລະບຸຊື່ຂອງທ່ານ ເພື່ອປ່ຽນຊື່ຜູ້ໃຊ້',
            icon: 'warning',
            confirmButtonText: 'ຕົກລົງ'
        });
        return; 
    }

    // 2. Check if the value is the same as the current name (no change)
    if (val === user.name) {
        // Optional: Close modal or just return since nothing changed
        Swal.fire({
            title: 'ແຈ້ງເຕືອນ!',
            text: 'ກະລຸນາລະບຸຊື່ຂອງທ່ານ',
            icon: 'warning',
            confirmButtonText: 'ຕົກລົງ'
        });
        return;
    }

                const res = await api('updateProfile', { phone: user.phone, name: val });
                if(res.status === 'success') {
                    user.name = val;
                    localStorage.setItem('banhom_session', JSON.stringify(user));
                    updateProfileUI();      
                     await Swal.fire({
                title: 'ສຳເລັດ!',
                text: 'ປ່ຽນຊື່ສຳເລັດແລ້ວ',
                icon: 'success',
                timer: 2000, // Auto close after 2 seconds
                showConfirmButton: false
            });      
                    
                    closeModal('inputModal');
                }
            };
            modal.classList.remove('hidden-el');





        }



      function openChangePassModal() {
    const modal = document.getElementById('inputModal');
    document.getElementById('modalTitle').innerText = "ປ່ຽນລະຫັດຜ່ານ";
    const content = document.getElementById('modalContent');
    content.innerHTML = `
        <input type="password" id="p1" class="w-full p-4 bg-gray-50 border rounded-2xl mb-2" placeholder="ລະຫັດຜ່ານໃໝ່">
        <input type="password" id="p2" class="w-full p-4 bg-gray-50 border rounded-2xl" placeholder="ຢືນຢັນລະຫັດຜ່ານໃໝ່">
    `;
    
    const btn = document.getElementById('modalConfirmBtn');
    btn.onclick = async () => {
        const v1 = document.getElementById('p1').value;
        const v2 = document.getElementById('p2').value;

        // 1. Check if the value is empty
        if (v1 === "" || v2 === "") {
            Swal.fire({
                title: 'ແຈ້ງເຕືອນ!',
                text: 'ກະລຸນາໃສ່ລະຫັດຜ່ານ',
                icon: 'warning',
                confirmButtonText: 'ຕົກລົງ'
            });
            return;
        }

        // 2. Check if the passwords match
        if (v1 !== v2) {
            Swal.fire({
                title: 'ແຈ້ງເຕືອນ!',
                text: 'ລະຫັດຜ່ານບໍ່ກົງກັນ',
                icon: 'warning',
                confirmButtonText: 'ຕົກລົງ'
            });
            return;
        }


        if(v1.length < 5 || v2.length < 5) return Swal.fire({ // ປ່ຽນເປັນ 5 ຕາມທີ່ text ບອກ
          icon: "error",
          title: "ລະຫັດຜ່ານສັ້ນເກີນໄປ",
          text: "ກະລຸນາໃສ່ລະຫັດຜ່ານຢ່າງນ້ອຍ 5 ຕົວເລກ",
    });

        // --- NEW SECTION: 3. Block weak sequential passwords ---
        const forbiddenPasswords = ["123", "1234", "12345", "123456", "1234567", "12345678", "123456789"];
        if (forbiddenPasswords.includes(v1)) {
            Swal.fire({
                title: 'ລະຫັດຜ່ານບໍ່ປອດໄພ!',
                text: 'ກະລຸນາຢ່າໃຊ້ລະຫັດຜ່ານທີ່ງ່າຍເກີນໄປ (ເຊັ່ນ: 123456)',
                icon: 'error',
                confirmButtonText: 'ຕົກລົງ'
            });
            return;
        }
        // -------------------------------------------------------

        const res = await api('updatePassword', { phone: user.phone, newPass: v1 });

        if (res.status === 'success') {
            closeModal('inputModal');
            await Swal.fire({
                title: 'ສຳເລັດ!',
                text: 'ປ່ຽນລະຫັດຜ່ານສຳເລັດແລ້ວ',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            Swal.fire('ຜິດພາດ', 'ບໍ່ສາມາດປ່ຽນລະຫັດຜ່ານໄດ້', 'error');
        }
    };

    modal.classList.remove('hidden-el');
}

       

        function formatDate(dStr) {
            if(!dStr) return '-';
            try {
                const d = new Date(dStr);
                if(isNaN(d.getTime())) return dStr;
                return d.toLocaleDateString('th-TH', { 
                    day: '2-digit', month: 'short', year: 'numeric', 
                    hour: '2-digit', minute: '2-digit' 
                });
            } catch(e) { return dStr; }
        }

        
    
function confirmLogout() {
    Swal.fire({
        title: 'ອອກລະບົບ?',
        text: "ທ່ານຕ້ອງການອອກລະບົບແທ້ບໍ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444', // สีแดง
        cancelButtonColor: '#94a3b8',
        confirmButtonText: 'ອອກລະບົບ',
        cancelButtonText: 'ຍົກເລີກ'
    }).then((result) => {
        if (result.isConfirmed) {
            // โค้ดสำหรับออกจากระบบ
            logout(); 
        }
    });
}


function confirmR() {
    Swal.fire({
        title: 'ຢືນຢັນຮັບສິນຄ້າ?',
        text: "คແນ່ໃຈແລ້ວບໍຖ້າທ່ານກົດ ຢືນຢັນ ຫໝາຍຄວາມວ່າຮັບສິນຄ້າແລ້ວ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444', // สีแดง
        cancelButtonColor: '#94a3b8',
        confirmButtonText: 'ຢືນຢັນ',
        cancelButtonText: 'ຍົກເລີກ'
    }).then((result) => {
        if (result.isConfirmed) {
            // โค้ดสำหรับออกจากระบบ
            logout(); 
        }
    });
}



function switchTab(tab) {
    // 1. Hide all content and reset all nav colors
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden-el'));
    document.querySelectorAll('.nav-item').forEach(i => {
        i.classList.remove('text-blue-600');
        i.classList.add('text-gray-400');
    });
    
    // 2. Routing Logic
    if(tab === 'home') {
        document.getElementById('tab-home').classList.remove('hidden-el');
        highlightNav(1);
    } 
    else if(tab === 'thailao' || tab === 'chinalao') {
        activeSheet = tab === 'thailao' ? 'data1' : 'data2';
        currentStatus = 'ທັງໝົດ';
        document.getElementById('logTitle').innerText = tab === 'thailao' ? 'ລາຍການ ໄທ-ລາວ' : 'ລາຍການ ຈີນ-ລາວ';
        document.getElementById('tab-logistics').classList.remove('hidden-el');
        
        // Highlight 2nd item for Thai-Lao, 4th for China-Lao
        highlightNav(tab === 'thailao' ? 2 : 4);
        renderLogisticsList();
    } 
    else if(tab === 'profile') {
        document.getElementById('tab-profile').classList.remove('hidden-el');
        highlightNav(5);
    }
}

// Helper to handle the Tailwind classes
function highlightNav(index) {
    const el = document.querySelector(`.nav-item:nth-child(${index})`);
    if(el) {
        el.classList.remove('text-gray-400');
        el.classList.add('text-blue-600');
    }
}