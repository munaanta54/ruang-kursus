import { useEffect, useMemo, useState } from 'react'
import {
  BookOpen, Users, Activity, CloudSun, Plus, Search, Edit3, Trash2,
  CheckCircle2, GraduationCap, LayoutDashboard, X, Clock3, UserPlus
} from 'lucide-react'
import { courseApi, participantApi, activityApi, weatherApi } from './api'

const emptyCourse = { title:'', slug:'', description:'', instructor:'', category:'Development', level:'Beginner', duration:'4 minggu', price:0, image_url:'', is_published:true }
const emptyParticipant = { name:'', email:'', course:'', completed:false }
const money = new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0})
const take = (data) => data?.results || data || []

export default function App(){
  const [page,setPage]=useState('courses')
  const [courses,setCourses]=useState([])
  const [participants,setParticipants]=useState([])
  const [activities,setActivities]=useState([])
  const [error,setError]=useState('')
  const [participantCount,setParticipantCount]=useState(0)
  const [participantPage,setParticipantPage]=useState(1)
  const [participantNext,setParticipantNext]=useState(null)
  const [participantPrevious,setParticipantPrevious]=useState(null)

 const refresh = async (page = participantPage) => {
  try {
    const [c, p, a] = await Promise.all([
      courseApi.list(),
      participantApi.list('', page),
      activityApi.list()
    ])

    setCourses(take(c))
    setParticipants(take(p))

    setParticipantCount(
      p?.count ?? take(p).length
    )

    setParticipantNext(p?.next || null)
    setParticipantPrevious(p?.previous || null)

    setActivities(take(a))
    setError('')
  } catch (e) {
    setError(e.message)
  }
}
  useEffect(()=>{refresh()},[])

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="logo"><span><BookOpen size={20}/></span><div><b>RuangKursus</b><small>Learning Studio</small></div></div>
      <nav>
        <Menu active={page==='courses'} onClick={()=>setPage('courses')} icon={<LayoutDashboard size={18}/>} label="Koleksi Kursus" />
        <Menu active={page==='participants'} onClick={()=>setPage('participants')} icon={<Users size={18}/>} label="Peserta" />
        <Menu active={page==='weather'} onClick={()=>setPage('weather')} icon={<CloudSun size={18}/>} label="Cuaca Hari Ini" />
        <Menu active={page==='activities'} onClick={()=>setPage('activities')} icon={<Activity size={18}/>} label="Aktivitas" />
       </nav>
      <div className="side-note"><small>DJANGO REST API</small><b>Backend terhubung</b><span><i/> 127.0.0.1:8000</span></div>
    </aside>
    <section className="main-area">
      <header className="topbar"><div><small>RUANGKURSUS ADMIN</small><b>Course Management</b></div><span className="api-pill"><i/> API connected</span></header>
      <main className="content">
        {error && <div className="error-box">{error}</div>}
        {page==='courses' && <Courses courses={courses} refresh={refresh}/>} 
        {page==='participants' && (
  <Participants
    participants={participants}
    participantCount={participantCount}
    participantPage={participantPage}
    setParticipantPage={setParticipantPage}
    participantNext={participantNext}
    participantPrevious={participantPrevious}
    courses={courses}
    refresh={refresh}
  />
)}
        {page==='activities' && <Activities activities={activities}/>} 
        {page==='weather' && <Weather/>}
      </main>
    </section>
  </div>
}

function Menu({active,onClick,icon,label}){return <button className={`menu ${active?'active':''}`} onClick={onClick}>{icon}<span>{label}</span></button>}

function Courses({courses,refresh}){
  const [query,setQuery]=useState(''); const [open,setOpen]=useState(false); const [editing,setEditing]=useState(null); const [form,setForm]=useState(emptyCourse)
  const filtered=useMemo(()=>courses.filter(c=>`${c.title} ${c.instructor} ${c.category}`.toLowerCase().includes(query.toLowerCase())),[courses,query])
  const begin=(c=null)=>{setEditing(c?.id||null);setForm(c||emptyCourse);setOpen(true)}
  const submit=async(e)=>{e.preventDefault(); const payload={...form,slug:form.slug||form.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')}; editing?await courseApi.update(editing,payload):await courseApi.create(payload);setOpen(false);setForm(emptyCourse);setEditing(null);await refresh()}
  const remove=async(id)=>{if(confirm('Hapus course ini?')){await courseApi.remove(id);await refresh()}}
  return <>
    <PageHead accent="Koleksi Kursus" text="Kelola katalog kursus, peserta, dan progres pembelajaran dari satu tempat." action={<button className="primary-btn" onClick={()=>begin()}><Plus size={17}/> Tambah Course</button>}/>
    <div className="stats-row"><Stat icon={<BookOpen/>} value={courses.length} label="Total Kursus"/><Stat icon={<Users/>} value={courses.reduce((n,c)=>n+(c.participants||0),0)} label="Total Peserta"/><Stat icon={<CheckCircle2/>} value={courses.filter(c=>c.is_published).length} label="Dipublikasikan"/></div>
    <div className="section-head"><div><small>KATALOG</small><h2>Semua Course</h2></div><SearchBox value={query} setValue={setQuery} placeholder="Cari course..."/></div>
    <div className="course-grid">{filtered.map((c,i)=><article className="course-card" key={c.id}><div className={`course-cover cover-${i%3}`}><GraduationCap size={30}/><span>{c.category}</span></div><div className="course-body"><div className="meta"><span>{c.level}</span><span className={c.is_published?'live':'draft'}>{c.is_published?'Live':'Draft'}</span></div><h3>{c.title}</h3><p>{c.description}</p><div className="course-info"><span><Users size={14}/>{c.participants||0} peserta</span><span><Clock3 size={14}/>{c.duration}</span></div><div className="course-bottom"><b>{money.format(c.price)}</b><span>{c.instructor}</span></div><div className="actions"><button onClick={()=>begin(c)}><Edit3 size={14}/>Edit</button><button className="danger" onClick={()=>remove(c.id)}><Trash2 size={14}/>Hapus</button></div></div></article>)}</div>
    {open && <Modal title={editing?'Edit Course':'Tambah Course'} onClose={()=>setOpen(false)}><CourseForm form={form} setForm={setForm} submit={submit} editing={editing}/></Modal>}
  </>
}

function CourseForm({form,setForm,submit,editing}){return <form className="modal-form" onSubmit={submit}><label>Judul<input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label><div className="two"><label>Instruktur<input required value={form.instructor} onChange={e=>setForm({...form,instructor:e.target.value})}/></label><label>Kategori<input value={form.category} onChange={e=>setForm({...form,category:e.target.value})}/></label></div><div className="two"><label>Level<select value={form.level} onChange={e=>setForm({...form,level:e.target.value})}><option value="Beginner">Pemula</option><option value="Intermediate">Menengah</option><option value="Advanced">Lanjutan</option></select></label><label>Durasi<input value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})}/></label></div><label>Harga<input type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></label><label>Deskripsi<textarea rows="4" required value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label><label className="check"><input type="checkbox" checked={form.is_published} onChange={e=>setForm({...form,is_published:e.target.checked})}/> Publikasikan course</label><button className="primary-btn wide">{editing?'Simpan Perubahan':'Tambah Course'}</button></form>}

function Participants({
  participants,
  participantCount,
  participantPage,
  setParticipantPage,
  participantNext,
  participantPrevious,
  courses,
  refresh
}){
  const [query,setQuery]=useState(''); const [open,setOpen]=useState(false); const [editing,setEditing]=useState(null); const [form,setForm]=useState(emptyParticipant)
  const filtered=participants.filter(p=>`${p.name} ${p.email} ${p.course_title}`.toLowerCase().includes(query.toLowerCase()))
  const begin=(p=null)=>{setEditing(p?.id||null);setForm(p?{name:p.name,email:p.email,course:p.course,completed:p.completed}:emptyParticipant);setOpen(true)}
  const submit=async(e)=>{e.preventDefault(); editing?await participantApi.update(editing,form):await participantApi.create(form);setOpen(false);setEditing(null);setForm(emptyParticipant);await refresh()}
  const remove=async(id)=>{if(confirm('Hapus peserta ini?')){await participantApi.remove(id);await refresh()}}
  const complete=async(p)=>{await participantApi.patch(p.id,{completed:!p.completed});await refresh()}
  const totalPages=Math.max(1,Math.ceil(participantCount/20))
  const goToPage=async(nextPage)=>{
    if(nextPage<1||nextPage>totalPages||nextPage===participantPage)return
    setParticipantPage(nextPage)
    await refresh(nextPage)
  }
  return <>
    <PageHead
      accent="Kelola peserta"
      text="Tambahkan peserta ke course dan tandai ketika pembelajaran telah selesai."
      action={<button className="primary-btn" onClick={()=>begin()}><UserPlus size={17}/> Tambah Peserta</button>}
    />

    <div className="stats-row">
      <Stat icon={<Users/>} value={participantCount} label="Total Peserta"/>
      <Stat icon={<CheckCircle2/>} value={participants.filter(p=>p.completed).length} label="Selesai di Halaman Ini"/>
      <Stat icon={<BookOpen/>} value={courses.length} label="Course Aktif"/>
    </div>

    <div className="section-head">
      <div><small>DATA PESERTA</small><h2>Daftar Peserta</h2></div>
      <SearchBox value={query} setValue={setQuery} placeholder="Cari peserta di halaman ini..."/>
    </div>

    <div className="table-card">
      <table>
        <thead>
          <tr><th>Peserta</th><th>Course</th><th>Status</th><th>Aksi</th></tr>
        </thead>
        <tbody>
          {filtered.map(p=>
            <tr key={p.id}>
              <td><b>{p.name}</b><small>{p.email}</small></td>
              <td>{p.course_title}</td>
              <td>
                <button className={`status-btn ${p.completed?'done':''}`} onClick={()=>complete(p)}>
                  {p.completed?'Selesai':'Belum selesai'}
                </button>
              </td>
              <td>
                <div className="row-actions">
                  <button onClick={()=>begin(p)}><Edit3 size={14}/></button>
                  <button onClick={()=>remove(p.id)}><Trash2 size={14}/></button>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {!filtered.length&&<div className="empty">Belum ada peserta.</div>}
    </div>

    <div style={{
      display:'flex',
      alignItems:'center',
      justifyContent:'center',
      gap:'10px',
      marginTop:'22px',
      flexWrap:'wrap'
    }}>
      <button
        className="primary-btn"
        disabled={!participantPrevious}
        onClick={()=>goToPage(participantPage-1)}
        style={{opacity:participantPrevious?1:.45}}
      >
        ← Sebelumnya
      </button>

      {Array.from({length:totalPages},(_,i)=>i+1).map(n=>(
        <button
          key={n}
          onClick={()=>goToPage(n)}
          style={{
            minWidth:'38px',
            height:'38px',
            borderRadius:'8px',
            border:'1px solid #d8ddd9',
            background:n===participantPage?'#173f37':'white',
            color:n===participantPage?'white':'#173f37',
            fontWeight:700,
            cursor:'pointer'
          }}
        >
          {n}
        </button>
      ))}

      <button
        className="primary-btn"
        disabled={!participantNext}
        onClick={()=>goToPage(participantPage+1)}
        style={{opacity:participantNext?1:.45}}
      >
        Berikutnya →
      </button>
    </div>

    <div style={{textAlign:'center',marginTop:'10px',fontSize:'12px',color:'#71807a'}}>
      Halaman {participantPage} dari {totalPages} · Total {participantCount} peserta
    </div>

    {open&&
      <Modal title={editing?'Edit Peserta':'Tambah Peserta'} onClose={()=>setOpen(false)}>
        <form className="modal-form" onSubmit={submit}>
          <label>Nama<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>
          <label>Email<input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label>
          <label>
            Course
            <select required value={form.course} onChange={e=>setForm({...form,course:e.target.value})}>
              <option value="">Pilih course</option>
              {courses.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </label>
          <label className="check">
            <input type="checkbox" checked={form.completed} onChange={e=>setForm({...form,completed:e.target.checked})}/>
            Course sudah selesai
          </label>
          <button className="primary-btn wide">Simpan Peserta</button>
        </form>
      </Modal>
    }
  </>
}

function Weather(){const [city,setCity]=useState('Jakarta');const [weather,setWeather]=useState(null);const [loading,setLoading]=useState(false);const load=async()=>{setLoading(true);try{setWeather(await weatherApi.get(city))}finally{setLoading(false)}};useEffect(()=>{load()},[]);return <><PageHead eyebrow="CUACA" title="Cuaca hari ini." accent={city} text="Data cuaca tersedia melalui endpoint Django API yang sudah ada."/><div className="weather-card"><CloudSun size={58}/><div><label>Kota<input value={city} onChange={e=>setCity(e.target.value)}/></label><button className="primary-btn" onClick={load}>Cek Cuaca</button></div>{loading?<p>Memuat...</p>:weather&&<div className="weather-info"><b>{weather.city||weather.name}</b><strong>{weather.temperature}°C</strong><span>{weather.description}</span><small>Kelembapan {weather.humidity}% · Angin {weather.wind_speed} m/s</small></div>}</div></>}

function Activities({activities}){
  const [query,setQuery]=useState(''); const [type,setType]=useState('all')
  const filtered=activities.filter(a=>(`${a.message} ${a.course_title||''} ${a.participant_name||''}`.toLowerCase().includes(query.toLowerCase()))&&(type==='all'||a.activity_type===type))
  return <><PageHead eyebrow="AKTIVITAS" title="Riwayat aktivitas." accent="Otomatis tercatat." text="Perubahan course dan peserta dicatat otomatis oleh backend Django."/><div className="activity-toolbar"><SearchBox value={query} setValue={setQuery} placeholder="Cari aktivitas..."/><select value={type} onChange={e=>setType(e.target.value)}><option value="all">Semua Aktivitas</option><option value="course_created">Course Ditambahkan</option><option value="course_updated">Course Diedit</option><option value="course_deleted">Course Dihapus</option><option value="participant_created">Peserta Ditambahkan</option><option value="participant_updated">Peserta Diedit</option><option value="participant_deleted">Peserta Dihapus</option><option value="course_completed">Course Selesai</option></select></div><div className="timeline-card"><div className="section-head compact"><div><small>TIMELINE</small><h2>Aktivitas Terbaru</h2></div><span className="count-pill">{filtered.length} aktivitas</span></div><div className="timeline">{filtered.map(a=><div className="timeline-item" key={a.id}><div className={`timeline-dot ${a.activity_type}`}>{a.activity_type==='course_completed'?'✓':a.activity_type.includes('deleted')?'×':a.activity_type.includes('created')?'+':'✎'}</div><div><div className="timeline-title"><span>{a.activity_label}</span><time>{new Date(a.created_at).toLocaleString('id-ID')}</time></div><h3>{a.message}</h3><div className="tags">{a.participant_name&&<span>👤 {a.participant_name}</span>}{a.course_title&&<span>📚 {a.course_title}</span>}</div></div></div>)}{!filtered.length&&<div className="empty">Belum ada aktivitas.</div>}</div></div></>
}



function PageHead({eyebrow,title,accent,text,action}){return <div className="page-head"><div><small>{eyebrow}</small><h1>{title}<br/><em>{accent}</em></h1><p>{text}</p></div>{action}</div>}
function Stat({icon,value,label}){return <div className="stat-card"><span>{icon}</span><div><strong>{value}</strong><small>{label}</small></div></div>}
function SearchBox({value,setValue,placeholder}){return <div className="search-box"><Search size={16}/><input value={value} onChange={e=>setValue(e.target.value)} placeholder={placeholder}/></div>}
function Modal({title,onClose,children}){return <div className="modal-backdrop"><div className="modal"><div className="modal-head"><div><small>RUANGKURSUS</small><h2>{title}</h2></div><button onClick={onClose}><X/></button></div>{children}</div></div>}
