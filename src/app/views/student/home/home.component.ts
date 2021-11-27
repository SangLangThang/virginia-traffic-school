import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { NgbCarousel, NgbCarouselConfig } from "@ng-bootstrap/ng-bootstrap";
export interface Slide {
  urlImg: string;
  title?: string;
  sub1?: string;
  sub2?: string;
}
export interface Benefit {
  title: string;
  sub?: string;
}
export interface Info {
  title: string;
  subs?: any[];
  texts?: any[];
}
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  providers: [NgbCarouselConfig],
})
export class HomeComponent implements OnInit, AfterViewInit {
  benefitFeatured: Benefit[] = [
    {
      title: "FREE Email Certificate",
    },
    {
      title: "Shortest Course Allowed",
      sub: "Just Five Easy Sections",
    },
    {
      title: "Exit & Return Anytime",
      sub: "You Work Automatically Saved",
    },
    {
      title: "100% Online, 100% Secure",
      sub: " All You Infomation Encrypted",
    },
  ];
  infos: Info[] = [
    {
      title:'Defensive Driving Benefits',
      texts:[
        {
          content: "Lower Insurance for 3 Years",
        },
        {
          content: "Instant Certificate Available",
        },
      ]
    },
    {
      title: "Virginia Driver Improvement Program",
      subs: [
        {
          content:
            "We are an Online Driver Improvement Program for anyone who needs to take a course to:",
        },
      ],
      texts: [
        {
          content: "Satisfy a court order or DMV requirement",
        },
        {
          content: "Dismiss a traffic ticket",
        },
        {
          content: "Reduce points or fines associated with a violation",
        },
        {
          content: "Receive 5 Safe Driving Points",
        },
        {
          content: "Earn a discount on your auto insurance",
        },
      ],
    },
    {
      title: "Certificate of Completion",
      subs: [
        {
          content:
            "Your certificate of completion will be emailed to you within 1-2 business days of your completion.",
        },
        {
          content:
            "Your completion information will be electronically submitted to DMV within 24 hours.",
        },
      ],
    },
    {
      title: "Only 5 Easy Sections!",
      subs: [
        {
          content:
            "Read through the course material from the convenience of your own home! The final exam consists of 50 multiple-choice questions.",
        },
      ],
    },
    {
      title: "Other Terms & Conditions",
      subs: [
        {
          content:
            "It is your responsibility to determine if your court accepts this computer-based driver improvement course to satisfy a court required driver improvement course.",
        },
        {
          content:
            "If you are under age 20, this computer-based driver improvement clinic will not satisfy a driver improvement clinic requirement. You must satisfactorily complete a clinic that provides classroom instruction.",
        },
        {
          content:
            "DMV is committed to promoting transportation safety through the certification of quality driver training programs. If you have comments or concerns about this course, call our toll-free number: 1-877-885-5790.",
        },
      ],
    },
    {
      title: "We Are Ready to Help You! Superior Customer Service",
      subs: [
        {
          content:
            "Full support is available by phone or email. Our traffic school/defensive driving specialists are ready to help. Our quality services are backed by a team of trained experts. Please call us anytime to answer all your questions about your traffic ticket, traffic school, or defensive driving. We are here to help!",
        },
      ],
    },
  ];
  slidesFeatured: Slide[] = [
    {
      urlImg: "assets/img/photo/featured-1.png",
    },
    {
      urlImg: "assets/img/photo/featured-2.png",
    },
    {
      urlImg: "assets/img/photo/seal-state.png",
    },
  ];
  slides: Slide[] = [
    {
      urlImg: "assets/img/photo/home-carousel-4.jpg",
      title: "dismiss your ticket cheap & fast",
      sub1: "Everything You Need to",
      sub2: "Milions of Drivers Dismissed Their Tickets with Us!",
    },
    {
      urlImg: "assets/img/photo/home-carousel-5.jpg",
      title: "dismiss your ticket cheap & fast",
      sub1: "Everything You Need to",
      sub2: "Milions of Drivers Dismissed Their Tickets with Us!",
    },
    {
      urlImg: "assets/img/photo/home-carousel-3.jfif",
      title: "dismiss your ticket cheap & fast",
      sub1: "Everything You Need to",
      sub2: "Milions of Drivers Dismissed Their Tickets with Us!",
    },
  ];
  @ViewChild("carousel", { static: false }) carousel: NgbCarousel;
  constructor(private router: Router) {}

  ngOnInit(): void {}
  ngAfterViewInit() {
    //this.carousel.pause();
  }
  goTarget(targetName:string) {
    this.router.navigate([], { fragment: targetName });
  }
}
