import { DOCUMENT } from "@angular/common";
import {
  Inject,
  Injectable,
  INJECTOR,
  Renderer2,
  RendererFactory2,
} from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";


@Injectable({
  providedIn: "root",
})
export class UserThemeService {
  private listsTheme = [
    {
      Code: "purple",
      Name: "Purple",
    },
    {
      Code: "default",
      Name: "Default",
    },
    {
      Code: "darkly",
      Name: "Darkly",
    }
  ]
  initialSetting = ''
  renderer: Renderer2;
  themeSelection: BehaviorSubject<string> =
    new BehaviorSubject<string>(this.initialSetting);

  constructor(
    rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private doc: Document
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  setTheme(theme: string) {
    this.removeAllTheme()
    if(theme === 'default'){
        return 
    }
    this.themeSelection.next(theme);
    this.attackTheme(theme);
  }
  getListsTheme(){
    return this.listsTheme.slice()
  }
  attackTheme(theme: string) {
    const url = `${theme}.css`;
    const link = this.renderer.createElement("link") as HTMLLinkElement;
    link.href = url;
    link.rel = "stylesheet";
    link.className = `admin_theme`;
    link.type = 'text/css'
    const head = this.doc.querySelector("head");
    const style = this.doc.querySelector("style")
    if (head) {
      this.renderer.insertBefore(head,link,style)
    }
  }
  removeAllTheme(){
    const themes =Array.from(this.doc.querySelectorAll(".admin_theme")) ;
    themes.forEach(theme => theme.remove())
  }
}
