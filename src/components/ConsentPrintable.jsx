import React from "react";

export const ConsentPrintable = ({
  hospital = {},
  patient = {},
  ipd = {},
  filledData = {},
}) => {
  const formatDate = (value) => {
    const d = value ? new Date(value) : new Date();
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day} / ${month} / ${year}`;
  };

  const formatTime = (value) => {
    const d = value ? new Date(value) : new Date();
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const val = (v) => v || "";

  const data = {
    hospitalName: hospital?.name || "HOSPITAL NAME",
    regNo: hospital?.registrationNumber || "",
    address: hospital?.address || "",
    phone: hospital?.phone || "",
    phone2: hospital?.alternatePhone || "",
    email: hospital?.email || "",
    uhid: patient?.uhid || "",
    ipdNo: ipd?.ipdNumber || "",
    name:
      filledData.relativeOrGuardianName ||
      patient?.relativeName ||
      patient?.name ||
      "",
    relation: filledData.relation || patient?.relation || "",
    patientName: patient?.name || "",
    address2: filledData.address || patient?.address || "",
    taluka: filledData.taluka || patient?.taluka || "",
    district: filledData.district || patient?.district || "",
    mobile: filledData.phone || patient?.mobile || patient?.phone || "",
    date: formatDate(ipd?.createdAt),
    time: formatTime(ipd?.createdAt),
    diagnosis: filledData.diagnosis || ipd?.diagnosis || "",
    place: hospital?.city || "",
    signName:
      filledData.signatureHolderName ||
      patient?.relativeName ||
      patient?.name ||
      "",
  };

  return (
    <div className="wrapper">
      <style>{`
        *{
          box-sizing:border-box;
        }

        body{
          margin:0;
          padding:0;
          background:#d1d5db;
          font-family:"Noto Sans Devanagari","Mangal","Arial Unicode MS",sans-serif;
        }

        .toolbar{
          text-align:center;
          padding:16px;
        }

        .btn{
          background:#2563eb;
          color:#fff;
          border:none;
          padding:10px 18px;
          border-radius:8px;
          font-weight:600;
          cursor:pointer;
        }

        .page{
          width:210mm;
          min-height:297mm;
          background:#fff;
          margin:auto;
          padding:10mm;
          color:#000;
          font-size:12px;
          line-height:1.35;
        }

        .header{
          display:flex;
          gap:10px;
          align-items:center;
          border-bottom:2px solid #000;
          padding-bottom:6px;
        }

        .logo{
          width:70px;
          height:70px;
          border:1px solid #000;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:10px;
          font-weight:700;
          text-align:center;
        }

        .head-center{
          flex:1;
          text-align:center;
        }

        .hospital{
          font-size:28px;
          font-weight:800;
          line-height:1.1;
        }

        .small{
          font-size:11px;
          margin-top:2px;
        }

        .contact{
          display:flex;
          justify-content:center;
          gap:20px;
          flex-wrap:wrap;
          margin-top:4px;
          font-size:11px;
        }

        .top-grid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:14px;
          margin-top:8px;
        }

        .box{
          border:1px solid #000;
          min-height:38px;
          display:flex;
          align-items:center;
          padding:0 8px;
          font-weight:700;
          font-size:13px;
        }

        .title{
          text-align:center;
          font-size:24px;
          font-weight:800;
          margin:10px 0 8px;
        }

        .row{
          display:flex;
          gap:8px;
          align-items:flex-end;
          margin-bottom:8px;
          flex-wrap:wrap;
        }

        .label{
          font-weight:700;
          white-space:nowrap;
        }

        .line{
          flex:1;
          border-bottom:1px solid #000;
          min-height:18px;
          padding:0 4px 2px;
        }

        .smallLine{
          width:150px;
          border-bottom:1px solid #000;
          min-height:18px;
          padding:0 4px 2px;
        }

        .paragraph{
          margin-top:6px;
          text-align:justify;
          line-height:1.45;
        }

        .section{
          margin-top:14px;
        }

        .sectionTop{
          display:flex;
          align-items:center;
          gap:10px;
          margin-bottom:6px;
        }

        .number{
          font-size:22px;
          font-weight:800;
          width:24px;
        }

        .check{
          width:24px;
          height:24px;
          border:1px solid #000;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:18px;
          font-weight:800;
        }

        .sectionBody{
          padding-left:32px;
          text-align:justify;
          line-height:1.45;
        }

        .inlineLine{
          display:inline-block;
          min-width:220px;
          border-bottom:1px dotted #000;
          margin:0 4px;
          padding:0 3px;
        }

        .benefits{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:4px 30px;
          margin:6px 0 6px 18px;
        }

        .footer{
          margin-top:28px;
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:20px;
        }

        .sign{
          text-align:center;
        }

        .signLine{
          border-top:1px solid #000;
          margin-top:35px;
          padding-top:4px;
        }

        @media print{
          .toolbar{
            display:none;
          }

          body{
            background:#fff;
          }

          .page{
            margin:0;
            width:210mm;
            min-height:297mm;
          }

          @page{
            size:A4;
            margin:0;
          }
        }
      `}</style>

      <div className="toolbar">
        <button className="btn" onClick={() => window.print()}>
          Print Consent Form
        </button>
      </div>

      <div className="page">
        {/* Header */}
        <div className="header">
          <div className="logo">
            {hospital?.logo ? (
              <img
                src={hospital.logo}
                alt="logo"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            ) : (
              <>LOGO</>
            )}
          </div>

          <div className="head-center">
            <div className="hospital">{data.hospitalName}</div>

            <div className="small">
              Hospital Registration No. : {data.regNo}
            </div>

            <div className="small">{data.address}</div>

            <div className="contact">
              <span>{data.phone}</span>
              <span>{data.phone2}</span>
              <span>{data.email}</span>
            </div>
          </div>
        </div>

        {/* top boxes */}
        <div className="top-grid">
          <div className="box">UHID No. : {data.uhid}</div>
          <div className="box">IPD No. : {data.ipdNo}</div>
        </div>

        {/* title */}
        <div className="title">✻ अनुमती पत्र ✻</div>

        {/* fields */}
        <div className="row">
          <div className="label">रुग्णाचे / नातेवाईकाचे नाव :</div>
          <div className="line">{data.name}</div>
        </div>

        <div className="row">
          <div className="label">रुग्णाशी नाते :</div>
          <div className="line">{data.relation}</div>
        </div>

        <div className="row">
          <div className="label">पत्ता :</div>
          <div className="line">{data.address2}</div>

          <div className="label">तालुका :</div>
          <div className="smallLine">{data.taluka}</div>

          <div className="label">जिल्हा :</div>
          <div className="smallLine">{data.district}</div>
        </div>

        <div className="row">
          <div className="label">दूरध्वनी क्रमांक :</div>
          <div className="line">{data.mobile}</div>
        </div>

        {/* paragraph */}
        <div className="paragraph">
          श्री./सौ./श्रीमती{" "}
          <span className="inlineLine">{data.name}</span>
          स्वतः / आमचे रुग्ण आज रोजी दिनांक{" "}
          <span className="inlineLine">{data.date}</span>
          वेळ <span className="inlineLine">{data.time}</span>
          वाजता <span className="inlineLine">{data.hospitalName}</span>
          या रुग्णालयात दाखल झाले / केले. रुग्णालयात दाखल झाल्यानंतर डॉक्टरांनी
          मला / आम्हाला महात्मा ज्योतिबा फुले जन आरोग्य योजने बद्दल संपूर्ण
          माहिती दिली.
        </div>

        {/* section 1 */}
        <div className="section">
          <div className="sectionTop">
            <div className="number">१.</div>

            <div className="check">
              {filledData.section1Consent === "yes" ? "✓" : ""}
            </div>
            <div>होय</div>

            <div className="check">
              {filledData.section1Consent === "no" ? "✓" : ""}
            </div>
            <div>नाही</div>
          </div>

          <div className="sectionBody">
            अ) रुग्णालयात दाखल झाल्यानंतर रुग्णालयातील डॉक्टरांनी मला / आम्हाला
            रुग्णाला
            <span className="inlineLine">{data.diagnosis}</span>
            हा आजार असल्याचे सांगितले व हा आजार / उपचार महात्मा ज्योतिबा फुले
            जन आरोग्य योजनेमध्ये समाविष्ट असल्याचे सांगण्यात आले.
            <br />
            <br />
            आ) महात्मा ज्योतिबा फुले जन आरोग्य योजने अंतर्गत मला / आमच्या
            रुग्णाला खालील सुविधा निशुल्क स्वरूपात मिळतील याची माहिती
            देण्यात आली आहे.
            <div className="benefits">
              <div>१. रुग्णालयातील खाटा</div>
              <div>२. निशुल्क निदान सेवा</div>
              <div>३. भूलसेवा व शस्त्रक्रिया</div>
              <div>४. आवश्यक औषध उपचार</div>
              <div>५. शुश्रुषा व भोजन</div>
              <div>६. एक वेळचा परतीचा प्रवास</div>
            </div>

            इ) अति प्रासंगिक / अपघात वेळी या योजनेचा लाभ घेत असताना आवश्यक
            कागदपत्रांची पूर्तता विहित कालावधीत पूर्ण करणार मी / आम्ही
            होयाची कबुली देतो.
            <br />
            <br />
            ई) आवश्यक कागदपत्रे वेळेत न झाल्यास योजनेचा लाभ घेण्यापासून वंचित
            राहील / राहणार असून उपचारासाठी लागणाऱ्या खर्चासाठी मी / आम्ही
            सर्वस्वी जबाबदार राहील / राहणार आहेत.
          </div>
        </div>

        {/* section 2 */}
        <div className="section">
          <div className="sectionTop">
            <div className="number">२.</div>

            <div className="check">
              {filledData.section2Consent === "yes" ? "✓" : ""}
            </div>
            <div>होय</div>

            <div className="check">
              {filledData.section2Consent === "no" ? "✓" : ""}
            </div>
            <div>नाही</div>
          </div>

          <div className="sectionBody">
            अ) रुग्णालयात दाखल झाल्यानंतर रुग्णालयातील डॉक्टरांनी मला / आमच्या
            रुग्णाला
            <span className="inlineLine">{data.diagnosis}</span>
            हा आजार असल्याचे सांगितले व हा आजार / उपचार महात्मा ज्योतिबा फुले
            जन आरोग्य योजनेमध्ये समाविष्ट नसल्याचे सांगण्यात आले.
            <br />
            <br />
            आ) वरील आजार / उपचार हा महात्मा ज्योतिबा फुले जन आरोग्य योजनेमध्ये
            समाविष्ट नसल्यामुळे संबंधित आजारावर मी / आम्ही स्वखर्चाने उपचार
            घेण्यास इच्छुक आहे / आहोत.
            <br />
            <br />
            तरीही याबाबत रुग्णालयाविरुद्ध माझी / आमची कुठल्याही प्रकारची तक्रार
            नाही. अनुमती पत्रातील वरील सर्व नमूद बाबी मी / आम्ही वाचल्या आहेत
            व त्या मला / आम्हाला मान्य आहेत.
          </div>
        </div>

        {/* footer */}
        <div className="footer">
          <div>
            <div>दिनांक : {data.date}</div>
            <div style={{ marginTop: "12px" }}>ठिकाण : {data.place}</div>
          </div>

          <div className="sign">
            <div>सही / अंगठा</div>
            <div className="signLine">
              रुग्णाचे / नातेवाईकाचे नाव
              <br />
              {data.signName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentPrintable;