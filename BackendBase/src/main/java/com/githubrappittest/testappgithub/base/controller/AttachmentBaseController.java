package com.githubrappittest.testappgithub.base.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import com.vs.rappit.base.attachment.logic.EvaAttachment;
import com.vs.rappit.base.attachment.model.FileDownloadInfo;
import com.vs.rappit.base.attachment.model.FileInfo;
import com.vs.rappit.base.attachment.model.FileUploadInfo;
import com.vs.rappit.base.model.EvaAttachmentResponse;
import com.vs.rappit.jersey.base.webservice.BaseWebService;
import com.vs.rappit.storage.files.AttachmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.security.access.prepost.PreAuthorize;
import com.vs.rappit.base.exception.InternalException;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AttachmentBaseController<BL extends AttachmentService>
    extends BaseWebService<BL, EvaAttachment> {

  private static final Logger LOGGER = LoggerFactory.getLogger(AttachmentBaseController.class);

  public AttachmentBaseController(BL logic) {
    super(logic);
  }

  // @PreAuthorize("hasAccess('/attachments/upload')")
  @PostMapping(path = "/upload")
  public List<EvaAttachmentResponse> upload(
      @RequestPart("files") MultipartFile[] multipartFileArray,
      @RequestParam("modelKey") String modelKey,
      @RequestParam("fieldName") String fieldName,
      @RequestParam(name = "fileDesc", required = false) String fileDesc) {
    LOGGER.info("Entering upload ...");
    try {
      if (multipartFileArray == null) {
        LOGGER.info("The file content is empty or null.");
        throw new InternalException("The file content is empty or null.");
      }
      FileUploadInfo fileUploadInfo = new FileUploadInfo();
      fileUploadInfo.setModelKey(fileDesc);
      fileUploadInfo.setFieldName(fieldName);
      fileUploadInfo.setFileDesc(fileDesc);
      List<FileInfo> fileInfo = new ArrayList<>(multipartFileArray.length);
      for (int i = 0; i < multipartFileArray.length; i++) {
        fileInfo.add(
            new FileInfo(
                multipartFileArray[i].getInputStream(),
                multipartFileArray[i].getOriginalFilename()));
      }
      fileUploadInfo.setFileInfo(fileInfo);
      return logic.upload(fileUploadInfo);
    } catch (IOException e) {
      LOGGER.error("An error occurred while uploading the file.");
      throw new InternalException("An error occurred while uploading the file.", e);
    } finally {
      LOGGER.info("Leaving upload ...");
    }
  }

  // @PreAuthorize("hasAccess('/attachments/download/attachment/{attachment_id}')")
  @GetMapping(path = "/download/attachment/{attachment_id}", produces = "application/octet-stream")
  public ResponseEntity<Resource> downloadAsAttachment(
      @PathVariable("attachment_id") String attachmentId) throws IOException {
    LOGGER.info("Entering downloadAsAttachment ...");
    try {
      FileDownloadInfo fileDownloadInfo = logic.download(attachmentId);

      ResponseEntity<Resource> response = null;
      if (fileDownloadInfo != null && fileDownloadInfo.getInputStream() != null) {
        InputStreamResource resource = new InputStreamResource(fileDownloadInfo.getInputStream());
        response =
            ResponseEntity.ok()
                .header(
                    "content-disposition",
                    "attachment; filename = " + fileDownloadInfo.getFileName())
                .body(resource);
      } else {
        response = ResponseEntity.notFound().build();
      }
      return response;
    } finally {
      LOGGER.info("Leaving downloadAsAttachment ...");
    }
  }
  // @PreAuthorize("hasAccess('/attachments/download/inline/{attachment_id}')")
  @GetMapping(path = "/download/inline/{attachment_id}", produces = "application/octet-stream")
  public ResponseEntity<Resource> downloadAsInline(
      @PathVariable("attachment_id") String attachmentId) throws IOException {
    LOGGER.info("Entering downloadAsInline ...");
    try {
      FileDownloadInfo fileDownloadInfo = logic.download(attachmentId);

      ResponseEntity<Resource> response = null;

      if (fileDownloadInfo != null && fileDownloadInfo.getInputStream() != null) {
        InputStreamResource resource = new InputStreamResource(fileDownloadInfo.getInputStream());
        response =
            ResponseEntity.ok()
                .header(
                    "content-disposition", "inline; filename = " + fileDownloadInfo.getFileName())
                .body(resource);
      } else {
        response = ResponseEntity.notFound().build();
      }

      return response;
    } finally {
      LOGGER.info("Leaving downloadAsInline ...");
    }
  }

  // @PreAuthorize("hasAccess('/attachments/all/{modelKey}')")
  @GetMapping("/all/{modelKey}")
  public List<EvaAttachment> getAllByModelKey(@PathVariable("modelKey") String modelKey)
      throws IOException {
    return logic.getAllByModelKey(modelKey);
  }

  // @PreAuthorize("hasAccess('/attachments/link')")
  @PostMapping("/link")
  public EvaAttachmentResponse addLink(@RequestBody EvaAttachment linkAttachment)
      throws IOException {
    return logic.addLink(linkAttachment);
  }

  // @PreAuthorize("hasAccess('/attachments/{ids}')")
  @DeleteMapping("/{ids}")
  public ResponseEntity deleteRecords(@PathVariable("ids") String ids) {
    boolean isDeleted = super.delete(ids);
    if (isDeleted) return ResponseEntity.ok().build();
    else return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
  }
}
