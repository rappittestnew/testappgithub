
import { Input, inject, Directive } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Directive({})
export class CaptionBarBaseComponent {
  @Input() captionbarConfig: any;
  data!: SafeHtml;

  private sanitizer = inject(DomSanitizer);

  onInit(): void {
  }

  renderHtml(item: any) {
    if (item.render) {
      let html = item.render(item);
      html = this.sanitizer.sanitize(0, html);
      /* OR */
      html = this.sanitizer.bypassSecurityTrustHtml(html);
      return html
    }
    return item.html;
  };

}
